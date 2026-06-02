document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function getCart() {
    return JSON.parse(localStorage.getItem("canteen_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("canteen_cart", JSON.stringify(cart));
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cartContainer");
    const checkoutBtn = document.getElementById("checkoutBtn");
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted mb-3"></i>
                <h4>Your cart is empty</h4>
                <p class="text-muted">Looks like you haven't added anything yet.</p>
                <a href="menu.html" class="btn btn-primary rounded-pill mt-3">Browse Menu</a>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.classList.add("disabled");
        updateSummary(0);
        return;
    }

    if (checkoutBtn) checkoutBtn.classList.remove("disabled");

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item d-flex align-items-center">
                <div class="bg-light rounded p-2 me-3 d-none d-sm-block" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                    <i class="bi bi-image text-muted"></i>
                </div>
                <div class="flex-grow-1">
                    <h5 class="mb-1 fw-bold">${item.name}</h5>
                    <span class="text-muted small">₹${item.price} each</span>
                </div>
                <div class="d-flex align-items-center mx-3">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="bi bi-dash"></i></button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="bi bi-plus"></i></button>
                </div>
                <div class="text-end" style="min-width: 80px;">
                    <div class="fw-bold fs-5 mb-1">₹${itemTotal}</div>
                    <button class="btn btn-sm btn-link text-danger p-0" onclick="removeItem(${item.id})">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateSummary(subtotal);
}

function updateQty(id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
        renderCart();
    }
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
}

function updateSummary(subtotal) {
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax;
    
    const subE = document.getElementById("cartSubtotal");
    const taxE = document.getElementById("cartTax");
    const totE = document.getElementById("cartTotal");
    
    if(subE) subE.textContent = `₹${subtotal}`;
    if(taxE) taxE.textContent = `₹${tax}`;
    if(totE) totE.textContent = `₹${total}`;
}
