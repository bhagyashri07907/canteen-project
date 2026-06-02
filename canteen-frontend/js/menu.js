// Mock data for menu items
const menuItems = [
    { id: 1, name: "Classic Burger", price: 80, rating: 4.5, category: "snacks", tag: "Hot", tagColor: "danger" },
    { id: 2, name: "Veggie Pizza", price: 150, rating: 4.2, category: "snacks" },
    { id: 3, name: "Cold Coffee", price: 60, rating: 4.8, category: "drinks" },
    { id: 4, name: "Healthy Salad Bowl", price: 120, rating: 4.6, category: "meals", tag: "Vegan", tagColor: "success" },
    { id: 5, name: "Pancakes", price: 90, rating: 4.7, category: "breakfast" },
    { id: 6, name: "Grilled Sandwich", price: 70, rating: 4.3, category: "snacks" },
    { id: 7, name: "Fried Rice", price: 110, rating: 4.4, category: "meals" },
    { id: 8, name: "Fresh Juice", price: 50, rating: 4.5, category: "drinks" },
    { id: 9, name: "Chocolate Brownie", price: 65, rating: 4.9, category: "desserts" },
    { id: 10, name: "Omelette", price: 55, rating: 4.1, category: "breakfast" },
    { id: 11, name: "Pasta Alfredo", price: 140, rating: 4.6, category: "meals" },
    { id: 12, name: "Iced Tea", price: 40, rating: 4.0, category: "drinks" }
];

let currentFilter = "all";
let searchQuery = "";
const itemsPerPage = 8;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initSearch();
    renderMenu();
});

function initFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove("active"));
            // Add active to clicked
            e.target.classList.add("active");
            
            currentFilter = e.target.getAttribute("data-filter");
            currentPage = 1;
            renderMenu();
        });
    });

    // Check for query param (e.g. from Home page category click)
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat) {
        const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
        if (btn) btn.click();
    }
}

function initSearch() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        currentPage = 1;
        renderMenu();
    });
}

function renderMenu() {
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = "";

    // Filter
    let filteredItems = menuItems.filter(item => {
        const matchCategory = currentFilter === "all" || item.category === currentFilter;
        const matchSearch = item.name.toLowerCase().includes(searchQuery);
        return matchCategory && matchSearch;
    });

    // Paginate
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

    if (paginatedItems.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><h4 class="text-muted">No items found.</h4></div>`;
    } else {
        paginatedItems.forEach(item => {
            const tagHtml = item.tag ? `<span class="badge bg-${item.tagColor} position-absolute top-0 end-0 m-2 z-1">${item.tag}</span>` : '';
            
            const card = `
                <div class="col-sm-6 col-md-4 col-lg-3 animate-fade-in">
                    <div class="card glass-panel food-card h-100 position-relative">
                        ${tagHtml}
                        <div class="food-img-wrapper">
                            <i class="bi bi-image"></i>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${item.name}</h5>
                            <div class="d-flex justify-content-between align-items-center mb-3 mt-auto">
                                <span class="fw-bold fs-5" style="color: var(--primary-color);">₹${item.price}</span>
                                <span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i> ${item.rating}</span>
                            </div>
                            <button class="btn btn-outline-primary w-100 rounded-pill" onclick="addToCart(${item.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML("beforeend", card);
        });
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById("paginationControls");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // Prev
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link glass-panel text-dark" href="#" onclick="changePage(${currentPage - 1}, event)">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        const linkStyle = i === currentPage ? `style="background-color: var(--primary-color); border-color: var(--primary-color); color: white;"` : `class="text-dark glass-panel"`;
        pagination.innerHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" ${linkStyle} href="#" onclick="changePage(${i}, event)">${i}</a>
            </li>
        `;
    }

    // Next
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link glass-panel text-dark" href="#" onclick="changePage(${currentPage + 1}, event)">Next</a>
        </li>
    `;
}

function changePage(page, event) {
    event.preventDefault();
    currentPage = page;
    renderMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    let cart = JSON.parse(localStorage.getItem("canteen_cart")) || [];
    const existing = cart.find(i => i.id === itemId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem("canteen_cart", JSON.stringify(cart));
    
    // Update badge globally
    if(typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    // Show toast or alert (Simple alert for now)
    alert(`${item.name} added to cart!`);
}
