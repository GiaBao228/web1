const scriptURL = 'https://script.google.com/macros/s/AKfycbzDbN3W23_iHxj7zrm25tpleyuIK6xX_b2jqXY3eN0_YC37ldA625wfKZXKn0CSKwy8/exec';

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');
    const overlay = document.getElementById('toast-overlay');

    if (!toast || !toastIcon || !toastMessage || !overlay) {
        console.error('Toast elements not found');
        alert(message);
        return;
    }

    toastMessage.innerText = message;

    if (type === 'success') {
        toast.style.borderLeft = '5px solid #2ecc71';
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = '#2ecc71';
    } else {
        toast.style.borderLeft = '5px solid #e74c3c';
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = '#e74c3c';
    }

    overlay.classList.add('active');
    toast.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
        toast.classList.remove('active');
    }, 1000); // Reduced from 3000ms to 1500ms for faster display
}

/**
 * Centralized function to submit form data to Google Sheets
 * @param {FormData} formData - The data to submit
 * @param {HTMLElement} submitBtn - The button to disable/enable
 * @param {string} successMsg - Message to show on success
 * @param {function} callback - Optional function to run on success
 */
function submitToGoogleSheets(formData, submitBtn, successMsg, callback) {
    if (submitBtn) {
        submitBtn.disabled = true;
        // Lưu lại text gốc nếu chưa có
        if (!submitBtn.getAttribute('data-original-text')) {
            submitBtn.setAttribute('data-original-text', submitBtn.innerText);
        }
        submitBtn.innerText = 'Đang xử lý...';
    }

    fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
        cache: 'no-cache'
    })
        .then(() => {
            // Với no-cors, nếu vào được .then nghĩa là yêu cầu đã được gửi đi thành công
            showToast(successMsg, 'success');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = submitBtn.getAttribute('data-original-text') || 'Gửi';
            }
            if (callback) callback();
        })
        .catch(error => {
            // Nếu vào .catch nghĩa là có lỗi mạng thực sự (mất kết nối, URL sai, hoặc bị chặn)
            console.error('Google Sheets Error:', error);
            showToast('Không thể gửi dữ liệu. Vui lòng kiểm tra kết nối mạng!', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = submitBtn.getAttribute('data-original-text') || 'Gửi';
            }
        });
}

/**
 * Ghi lại hoạt động của người dùng vào Google Sheets
 * @param {string} action - Hành động (ví dụ: 'View Page', 'Add to Cart')
 * @param {string} details - Chi tiết hành động
 */
function recordActivity(action, details = '') {
    const formData = new FormData();
    formData.append('form_type', 'activity_log');
    formData.append('action', action);
    formData.append('details', details);
    formData.append('url', window.location.href);
    formData.append('timestamp', new Date().toLocaleString('vi-VN'));

    // Lấy thông tin user nếu có (Sửa lại để khớp với auth.js)
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (userEmail) {
        formData.append('user', `${userName || 'User'} (${userEmail})`);
    } else {
        formData.append('user', 'Guest');
    }

    // Sử dụng keepalive: true để đảm bảo request vẫn được gửi đi ngay cả khi trang bị đóng/reload
    fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
        cache: 'no-cache',
        keepalive: true
    }).catch(err => console.error('Logging failed:', err));
}

// Tự động ghi log khi tải trang
window.addEventListener('load', () => {
    const pageTitle = document.title || 'Unknown Page';
    recordActivity('View Page', `Trang: ${pageTitle}`);

    // Ghi lại hoạt động nhập liệu (trừ mật khẩu)
    document.addEventListener('blur', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            // Không ghi log mật khẩu
            if (target.type === 'password') return;

            const fieldName = target.name || target.id || target.placeholder || 'unnamed field';
            const value = target.value;

            if (value.trim() !== '') {
                recordActivity('Input Change', `Trường: ${fieldName} | Giá trị: ${value}`);
            }
        }
    }, true); // Use capture phase to ensure we catch events

    // Ghi lại hoạt động click vào các nút hoặc liên kết quan trọng
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .cart_icon_container');
        if (target) {
            let action = 'Click';
            let details = '';

            if (target.tagName === 'A') {
                action = 'Click Link';
                details = `Link: ${target.innerText.trim()} | To: ${target.href}`;
            } else if (target.tagName === 'BUTTON' || target.classList.contains('category_menu_btn')) {
                action = 'Click Button';
                details = `Button: ${target.innerText.trim() || target.title || 'unnamed button'}`;
            } else if (target.classList.contains('cart_icon_container')) {
                action = 'Click Cart';
                details = 'Mở giỏ hàng';
            }

            if (details) {
                recordActivity(action, details);
            }
        }
    }, true);
});