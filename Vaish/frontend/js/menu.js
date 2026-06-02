// Mock data for menu items
const menuItems = [
    { id: 1, name: "Classic Burger", price: 80, rating: 4.5, category: "snacks", tag: "Hot", tagColor: "danger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Veggie Pizza", price: 150, rating: 4.2, category: "snacks", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Cold Coffee", price: 60, rating: 4.8, category: "drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Healthy Salad Bowl", price: 120, rating: 4.6, category: "meals", tag: "Vegan", tagColor: "success", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Pancakes", price: 90, rating: 4.7, category: "breakfast", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Grilled Sandwich", price: 70, rating: 4.3, category: "snacks", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Fried Rice", price: 110, rating: 4.4, category: "meals", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Fresh Juice", price: 50, rating: 4.5, category: "drinks", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60" },
    { id: 9, name: "Chocolate Brownie", price: 65, rating: 4.9, category: "desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=60" },
    { id: 10, name: "Omelette", price: 55, rating: 4.1, category: "breakfast", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=60" },
    { id: 11, name: "Pasta Alfredo", price: 140, rating: 4.6, category: "meals", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=60" },
    { id: 12, name: "Iced Tea", price: 40, rating: 4.0, category: "drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=60" },
    { id: 13, name: "Paneer Tikka", price: 180, rating: 4.7, category: "snacks", tag: "Hot", tagColor: "danger", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=60" },
    { id: 14, name: "Hakka Noodles", price: 110, rating: 4.3, category: "meals", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=60" },
    { id: 15, name: "Masala Dosa", price: 90, rating: 4.6, category: "breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60" },
    { id: 16, name: "Oreo Shake", price: 95, rating: 4.8, category: "drinks", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=60" },
    { id: 17, name: "French Fries", price: 60, rating: 4.2, category: "snacks", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=60" },
    { id: 18, name: "Veg Momos", price: 80, rating: 4.5, category: "snacks", tag: "Popular", tagColor: "info", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=500&q=60" },
    { id: 20, name: "Mango Lassi", price: 55, rating: 4.7, category: "drinks", image: "https://images.unsplash.com/photo-1626078436897-40092120e300?auto=format&fit=crop&w=500&q=60" }
];

let currentFilter = "all";
let searchQuery = "";
let currentPage = 1;
const itemsPerPage = 8;
let favorites = JSON.parse(localStorage.getItem("canteen_favorites")) || [];

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initSearch();
    initVoiceSearch();
    renderMenu();
});

function initVoiceSearch() {
    const voiceBtn = document.getElementById("voiceSearchBtn");
    const searchInput = document.getElementById("searchInput");
    
    if (!voiceBtn) return;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        voiceBtn.style.display = "none";
        console.warn("Speech Recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.innerHTML = '<i class="bi bi-mic-fill text-danger animate-pulse"></i>';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Voice Input:", transcript);
        
        // Handle "search burger" or just "burger"
        let query = transcript;
        if (transcript.startsWith("search ")) {
            query = transcript.replace("search ", "").trim();
        }
        
        searchInput.value = query;
        searchQuery = query;
        currentPage = 1;
        renderMenu();
        
        voiceBtn.innerHTML = '<i class="bi bi-mic"></i>';
    };

    recognition.onerror = () => {
        voiceBtn.innerHTML = '<i class="bi bi-mic"></i>';
    };

    recognition.onend = () => {
        voiceBtn.innerHTML = '<i class="bi bi-mic"></i>';
    };
}

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
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1;
            renderMenu();
        });
    }
}

function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(itemId);
    }
    localStorage.setItem("canteen_favorites", JSON.stringify(favorites));
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    
    // Show Skeletons
    renderSkeletons();

    // Simulate Network Delay for UX
    setTimeout(() => {
        grid.innerHTML = "";

        // Filter
        let filteredItems = menuItems.filter(item => {
            const isFav = favorites.includes(item.id);
            const matchCategory = currentFilter === "all" || item.category === currentFilter || (currentFilter === "favorites" && isFav);
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
                const isFav = favorites.includes(item.id);
                const favIcon = isFav ? "bi-heart-fill text-danger" : "bi-heart";
                
                const card = `
                    <div class="col-sm-6 col-md-4 col-lg-3 animate-fade-in">
                        <div class="card glass-panel food-card h-100 position-relative">
                            ${tagHtml}
                            <button class="btn btn-sm position-absolute top-0 start-0 m-2 z-1" onclick="toggleFavorite(${item.id})">
                                <i class="bi ${favIcon} fs-4"></i>
                            </button>
                            <img src="${item.image}" alt="${item.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title fw-bold">${item.name}</h5>
                                <div class="d-flex justify-content-between align-items-center mb-3 mt-auto">
                                    <span class="fw-bold fs-5" style="color: var(--primary-color);">₹${item.price}</span>
                                    <div class="small text-muted"><i class="bi bi-star-fill text-warning me-1"></i>${item.rating}</div>
                                </div>
                                <button class="btn btn-primary rounded-pill w-100 mt-auto" onclick="addToCart(${item.id})">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        }
        renderPagination(totalPages);
    }, 800);
}

function renderSkeletons() {
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = "";
    for (let i = 0; i < itemsPerPage; i++) {
        grid.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card glass-panel border-0 h-100">
                    <div class="skeleton" style="height: 200px; border-radius: 12px 12px 0 0;"></div>
                    <div class="card-body">
                        <div class="skeleton skeleton-title"></div>
                        <div class="d-flex justify-content-between">
                            <div class="skeleton skeleton-text" style="width: 40%;"></div>
                            <div class="skeleton skeleton-text" style="width: 20%;"></div>
                        </div>
                        <div class="skeleton rounded-pill mt-3" style="height: 40px;"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

function renderPagination(totalPages) {
    const pagination = document.getElementById("paginationControls");
    if (!pagination) return;
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
