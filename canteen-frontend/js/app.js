/* App Configuration and Global Logic */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Components (Navbar, Footer)
    loadComponent("navbar-placeholder", "components/navbar.html", () => {
        initThemeToggle();
        updateCartBadge();
    });
    loadComponent("footer-placeholder", "components/footer.html");

    // 2. Initialize Theme
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
});

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
