document.addEventListener("DOMContentLoaded", () => {
    // Admin dashboard specific logic (Charts, data tables, etc.)
    // We will keep this minimal for the static UI
});

function handleAdminLogin(e) {
    e.preventDefault();
    // Simulate auth
    window.location.href = "dashboard.html";
}

function deleteMenu(id) {
    if(confirm("Are you sure you want to delete this item?")) {
        // Find row and remove
        const row = document.getElementById("menuRow-" + id);
        if(row) row.remove();
    }
}
