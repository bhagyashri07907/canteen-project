document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
});

async function fetchOrders() {
    try {
        console.log("Fetching orders...");
        const response = await fetch("http://localhost:5000/orders");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        console.log("Orders received:", data.orders);
        if (data.orders) {
            renderDashboard(data.orders);
        }
    } catch(err) {
        console.error("Failed to fetch orders:", err);
        const tableBody = document.getElementById("orders-table-body");
        if(tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Error connecting to server. Make sure backend is running.</td></tr>`;
        }
    }
}

function renderDashboard(orders) {
    const tableBody = document.getElementById("orders-table-body");
    const totalOrdersEl = document.getElementById("total-orders");
    const revenueTodayEl = document.getElementById("revenue-today");
    const pendingOrdersEl = document.getElementById("pending-orders");

    if (!tableBody) return; 
    
    // Check if we are on Dashboard or Orders page
    const isDashboard = window.location.pathname.includes("dashboard.html");
    
    let totalOrders = orders.length;
    let totalRevenue = 0;
    let pendingCount = 0;
    
    // Calculate stats regardless of view
    orders.forEach(order => {
        totalRevenue += order.total;
        if (order.status === "Pending" || order.status === "Preparing" || order.status === "Accepted") {
            pendingCount++;
        }
    });

    // Update stat cards
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (revenueTodayEl) revenueTodayEl.textContent = `₹${totalRevenue}`;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingCount;

    if (totalOrders === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No orders received yet.</td></tr>';
        return;
    }
    
    // If dashboard, only show recent 5
    let displayOrders = orders;
    
    let html = "";
    displayOrders.forEach(order => {
        // Items formatted
        let itemsStr = order.items.map(i => `${i.quantity}x ${i.name}`).join(", ");
        
        // Status Badge
        let badgeClass = "bg-warning text-dark";
        if (order.status === "Ready for Pickup") badgeClass = "bg-info text-dark";
        if (order.status === "Delivered" || order.status === "Completed") badgeClass = "bg-success";
        
        // Action Button logic
        let actionBtn = "";
        if (order.status === "Pending") {
            actionBtn = `<button class="btn btn-sm btn-info" onclick="updateOrderStatus('${order._id}', 'Accepted')">Accept</button>`;
        } else if (order.status === "Accepted") {
            actionBtn = `<button class="btn btn-sm btn-warning" onclick="updateOrderStatus('${order._id}', 'Preparing')">Prepare</button>`;
        } else if (order.status === "Preparing") {
            actionBtn = `<button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order._id}', 'Ready for Pickup')">Mark Ready</button>`;
        } else if (order.status === "Ready for Pickup") {
            actionBtn = `<button class="btn btn-sm btn-success" onclick="updateOrderStatus('${order._id}', 'Delivered')">Complete</button>`;
        } else {
            actionBtn = `<button class="btn btn-sm btn-light border" disabled><i class="bi bi-check-all text-success"></i> Done</button>`;
        }
        
        let tableBadge = order.tableNumber ? `<span class="badge bg-dark ms-1">T-${order.tableNumber}</span>` : '';
        
        // Payment Info logic
        let paymentInfo = "";
        let payBadgeClass = order.paymentStatus === 'Verified' ? 'bg-success' : 'bg-secondary';
        if (order.paymentStatus === 'Paid (To be Verified)') payBadgeClass = 'bg-info text-dark';
        
        paymentInfo = `<div><span class="badge ${payBadgeClass} mb-1">${order.paymentStatus}</span></div>`;
        if (order.transactionId) {
            paymentInfo += `<div class="small text-muted" style="font-size: 0.75rem;">ID: ${order.transactionId}</div>`;
            if (order.paymentStatus !== 'Verified') {
                paymentInfo += `<button class="btn btn-link btn-sm p-0 text-decoration-none" onclick="verifyPayment('${order._id}')">Mark Verified</button>`;
            }
        } else {
            paymentInfo += `<div class="small text-muted">${order.paymentMethod}</div>`;
        }

        html += `
            <tr>
                <td><span class="fw-bold text-primary">#${order._id.substring(order._id.length - 6).toUpperCase()}</span></td>
                <td>${order.customerName || "Guest"} ${tableBadge}</td>
                <td>${itemsStr}</td>
                <td>₹${order.total}</td>
                <td>${paymentInfo}</td>
                <td><span class="badge ${badgeClass}">${order.status}</span></td>
                <td>${actionBtn}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

async function verifyPayment(orderId) {
    if (!confirm("Confirm this payment has been received in your bank/UPI?")) return;
    try {
        const response = await fetch(`http://localhost:5000/update-order-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: null, paymentStatus: 'Verified' })
        });
        if (response.ok) fetchOrders();
    } catch (err) {
        console.error("Verification failed:", err);
    }
}

// Socket Integration
let socket;
if (typeof io !== 'undefined') {
    socket = io("http://localhost:5000");
    socket.on('new-order', (order) => {
        console.log("Real-time: New Order Received!", order);
        fetchOrders();
        // Play notification sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed"));
        
        // Show browser notification if permitted
        if (Notification.permission === "granted") {
            new Notification("New Canteen Order!", { body: `New order from ${order.customerName || 'Guest'}` });
        }
    });
} else {
    console.warn("Socket.io not loaded. Real-time updates disabled.");
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch("http://localhost:5000/update-order-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
        });
        
        const data = await response.json();
        if(response.ok) {
            // Refresh dashboard
            fetchOrders();
        } else {
            alert("Error updating order: " + data.error);
        }
    } catch(err) {
        console.error("Failed to update status:", err);
        alert("Server error. Could not update status.");
    }
}
