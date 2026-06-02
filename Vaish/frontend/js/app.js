/* App Configuration and Global Logic */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Components (Navbar, Footer)
    loadComponent("navbar-placeholder", "components/navbar.html", () => {
        initThemeToggle();
        updateCartBadge();
        checkAuth();
    });
    loadComponent("footer-placeholder", "components/footer.html");

    // 2. Initialize Theme
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    // 3. Request Notification Permission
    requestNotificationPermission();
});

function requestNotificationPermission() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
}

// Function to fetch and inject HTML components
async function loadComponent(placeholderId, componentPath, callback = null) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        placeholder.innerHTML = html;
        if (callback) callback();
    } catch (error) {
        console.error("Component loading error:", error);
    }
}

// Theme toggling logic
function initThemeToggle() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (!themeToggleBtn) return;

    const currentTheme = document.documentElement.getAttribute("data-theme");
    updateThemeIcon(themeToggleBtn, currentTheme);

    themeToggleBtn.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        let newTheme = theme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(themeToggleBtn, newTheme);
    });
}

function updateThemeIcon(btn, theme) {
    if (theme === "dark") {
        btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    }
}

// Global Cart Badge Logic (Mock)
function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");
    if (!cartBadge) return;
    
    // In a real app, read from localStorage or context
    const cart = JSON.parse(localStorage.getItem("canteen_cart")) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove("d-none");
    } else {
        cartBadge.classList.add("d-none");
    }
}

// Authentication Logic
function checkAuth() {
    const authNavItem = document.getElementById("auth-nav-item");
    if (!authNavItem) return;

    const user = localStorage.getItem("canteen_user");
    if (user) {
        authNavItem.innerHTML = `
            <a class="nav-link d-inline-block me-3 align-middle" href="history.html"><i class="bi bi-clock-history me-1"></i> History</a>
            <a class="btn btn-outline-danger btn-sm rounded-pill px-3" href="#" onclick="handleLogout(event)">Logout (${user})</a>
        `;
    } else {
        authNavItem.innerHTML = `<a class="btn btn-outline-primary btn-sm rounded-pill px-3" href="login.html">Login</a>`;
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("canteen_user");
    window.location.reload();
}
