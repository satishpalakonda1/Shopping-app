let cartItems = [];

function bodyload() {
    GetCategories();
    GetProducts("https://fakestoreapi.com/products");
    GetCartItemsCount();
}

function GetCategories() {
    fetch("https://fakestoreapi.com/products/categories")
        .then(response => response.json())
        .then(data => {
            data.unshift("All");
            data.forEach(item => {
                const option = document.createElement("option");
                option.text = item.toUpperCase();
                option.value = item;
                document.getElementById("lstCategories").appendChild(option);
            });
        });
}

function GetProducts(url) {
    document.getElementById("productsContainer").innerHTML = "";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <img src=${item.image} class="product-image">
                    <div class="product-details">
                        <h3 class="product-title">${item.title}</h3>
                        <div class="product-price">$${item.price.toFixed(2)}</div>
                        <div class="product-rating">
                            <div class="rating-stars">
                                ${getRatingStars(item.rating.rate)}
                            </div>
                            <span>(${item.rating.count} reviews)</span>
                        </div>
                        <button onclick="AddToCartClick(${item.id})" class="add-to-cart">
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                    </div>`;
                document.getElementById("productsContainer").appendChild(productCard);
            });
        });
}

function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star"></i>';
    }
    return stars;
}

function CategoryChanged() {
    const categoryName = document.getElementById("lstCategories").value;
    if (categoryName == "All") {
        GetProducts("http://fakestoreapi.com/products");
    } else {
        GetProducts(`http://fakestoreapi.com/products/category/${categoryName}`);
    }
}

function GetCartItemsCount() {
    document.getElementById("cartCount").innerHTML = cartItems.length;
    updateCartTotal();
}

function AddToCartClick(id) {
    fetch(`http://fakestoreapi.com/products/${id}`)
        .then(response => response.json())
        .then(data => {
            cartItems.push(data);
            GetCartItemsCount();
            showToast('Item added to cart successfully!');
        });
}

function ShowCartClick() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    
    cartItems.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><img src="${item.image}" width="50" height="50"></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    ShowCartClick();
    GetCartItemsCount();
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast show position-fixed top-0 end-0 m-3";
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function checkout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Thank you for your purchase!');
    cartItems = [];
    GetCartItemsCount();
    ShowCartClick();
}

document.addEventListener('DOMContentLoaded', bodyload);
