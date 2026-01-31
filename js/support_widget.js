// Support Widget JavaScript

(function () {
    'use strict';

    // Create widget HTML structure
    function createSupportWidget() {
        const widgetHTML = `
            <div class="support-widget">
                <!-- Menu items (shown on hover) -->
                <div class="support-menu">
                    <div class="support-widget-header">
                        Hướng dẫn - Hỗ trợ
                    </div>
                    
                    <a href="#" class="support-widget-item consult" onclick="showZaloQR(event)">
                        <div class="support-widget-icon">
                            <img src="images/zalo-logo.png" alt="Zalo">
                        </div>
                        <div class="support-widget-content">
                            <div class="support-widget-title">Hỗ trợ tư vấn (24/24)</div>
                            <div class="support-widget-subtitle">Tư vấn tài liệu, mua tài liệu</div>
                        </div>
                    </a>

                    <a href="#" class="support-widget-item technical" onclick="showZaloQR(event)">
                        <div class="support-widget-icon">
                            <img src="images/zalo-logo.png" alt="Zalo">
                        </div>
                        <div class="support-widget-content">
                            <div class="support-widget-title">Hỗ trợ kỹ thuật (24/24)</div>
                            <div class="support-widget-subtitle">Các vấn đề Nạp tiền, Tải tài liệu</div>
                        </div>
                    </a>

                    <a href="#" class="support-widget-item register" onclick="showZaloQR(event)">
                        <div class="support-widget-icon">
                            <img src="images/zalo-logo.png" alt="Zalo">
                        </div>
                        <div class="support-widget-content">
                            <div class="support-widget-title">ĐĂNG KÝ HỢP TÁC</div>
                            <div class="support-widget-subtitle">Đăng tải tài liệu lên website</div>
                        </div>
                    </a>

                    <a href="#" class="support-widget-item download" onclick="showZaloQR(event)">
                        <div class="support-widget-icon">
                            <img src="images/zalo-logo.png" alt="Zalo">
                        </div>
                        <div class="support-widget-content">
                            <div class="support-widget-title">THƯ MUA TÀI LIỆU</div>
                            <div class="support-widget-subtitle">Băn tải liệu cho website</div>
                        </div>
                    </a>
                </div>

                <!-- Main chat button -->
                <div class="support-chat-button">
                    <img src="images/zalo-logo.png" alt="Zalo Chat">
                </div>
            </div>

            <!-- Zalo QR Modal -->
            <div id="zaloQRModal" class="zalo-qr-modal">
                <div class="zalo-qr-modal-content">
                    <span class="zalo-qr-close">&times;</span>
                    <h3>Quét mã QR để kết nối Zalo</h3>
                    <img src="images/zalo-qr.png" alt="Zalo QR Code" class="zalo-qr-image">
                    <p>Mở ứng dụng Zalo và quét mã QR để liên hệ</p>
                </div>
            </div>
        `;

        // Insert widget into body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Add event listeners for modal
        const modal = document.getElementById('zaloQRModal');
        const closeBtn = document.querySelector('.zalo-qr-close');

        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Initialize widget when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSupportWidget);
    } else {
        createSupportWidget();
    }
})();

// Global function to show QR modal
function showZaloQR(event) {
    event.preventDefault();
    document.getElementById('zaloQRModal').style.display = 'flex';
}
