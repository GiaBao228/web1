/* Cart Logic */

// Get cart key based on logged-in user
function getCartKey() {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? `cart_${userEmail}` : 'cart';
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    const cartCountElements = document.querySelectorAll('#cart_count');
    cartCountElements.forEach(el => {
        el.innerText = cart.length;
    });
}

function addToCartById(id, title, price, img) {
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        // Show login modal if not logged in
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';
        }
        if (typeof showToast === 'function') {
            showToast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
        } else {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
        }
        return;
    }

    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // Check if item already exists
    const exists = cart.find(item => item.id === id);
    if (exists) {
        if (typeof showToast === 'function') {
            showToast('Khóa học "' + title + '" đã có trong giỏ hàng!', 'error');
        } else {
            alert('Khóa học "' + title + '" đã có trong giỏ hàng!');
        }
        return;
    }

    cart.push({ id: id, title: title, price: price, img: img });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();

    // Custom event to notify other parts of the app if needed
    window.dispatchEvent(new Event('cartUpdated'));

    if (typeof showToast === 'function') {
        showToast('Đã thêm "' + title + '" vào giỏ hàng!', 'success');
    } else {
        alert('Đã thêm "' + title + '" vào giỏ hàng!');
    }

    if (typeof recordActivity === 'function') {
        recordActivity('Add to Cart', `Course: ${title} (ID: ${id})`);
    }
}

// Generic handler for buttons with data attributes
function handleAddToCart(btn) {
    const id = btn.getAttribute('data-id');
    const title = btn.getAttribute('data-title');
    const price = btn.getAttribute('data-price');
    const img = btn.getAttribute('data-img');

    if (id && title && price) {
        addToCartById(id, title, price, img);
    }
}

// Sync cart count across tabs
window.addEventListener('storage', function (e) {
    if (e.key === getCartKey() || e.key === 'userEmail') {
        updateCartCount();
    }
});

$(document).ready(function () {
    updateCartCount();
});

