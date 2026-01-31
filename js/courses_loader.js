/**
 * Reusable dynamic course loader for publice pages (index.html, courses.html)
 */

window.allCourses = [];

function loadPublicCourses(containerId, isHomepage = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="col-12 text-center"><p>Đang tải danh sách khóa học...</p></div>';

    fetch(`${scriptURL}?type=get_courses&t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(data => {
            if (data.result === 'success') {
                window.allCourses = data.courses;
                renderPublicCourses(window.allCourses, containerId, isHomepage);
            } else {
                container.innerHTML = `<div class="col-12 text-center text-danger"><p>Lỗi: ${data.message}</p></div>`;
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            container.innerHTML = '<div class="col-12 text-center text-danger"><p>Lỗi kết nối máy chủ</p></div>';
        });
}

function renderPublicCourses(courses, containerId, isHomepage = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // If homepage, we might want to limit to 3 or 6 courses
    const displayCourses = isHomepage ? courses.slice(0, 6) : courses;

    if (displayCourses.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>Không tìm thấy khóa học nào phù hợp.</p></div>';
        return;
    }

    displayCourses.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 course_box';

        col.innerHTML = `
            <div class="card">
                <img class="card-img-top" src="${c.img || 'images/course_default.jpg'}" alt="${c.title}">
                <div class="card-body text-center">
                    <div class="card-title"><a href="course_detail.html?id=${c.id}">${c.title}</a></div>
                    <div class="card-text">${c.text || ''}</div>
                </div>
                <div class="price_box d-flex flex-row align-items-center">
                    <div class="course_author_image">
                        <img src="images/author.jpg" alt="Author">
                    </div>
                    <div class="course_author_name">${c.author || 'Mr. Brian'}, <span>Author</span></div>
                    <div class="course_price d-flex flex-column align-items-center justify-content-center">
                        <span>${c.price}đ</span>
                    </div>
                </div>
                <div class="px-3">
                    <button class="add_to_cart_btn" 
                        data-id="${c.id}" 
                        data-title="${c.title}" 
                        data-price="${c.price}" 
                        data-img="${c.img}" 
                        onclick="handleAddToCart(this)">Thêm vào giỏ hàng</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function filterCoursesBySearch(query, containerId, isHomepage = false) {
    const filtered = window.allCourses.filter(c => {
        const titleMatch = c.title && c.title.toLowerCase().includes(query.toLowerCase());
        const textMatch = c.text && c.text.toLowerCase().includes(query.toLowerCase());
        const authorMatch = c.author && c.author.toLowerCase().includes(query.toLowerCase());
        return titleMatch || textMatch || authorMatch;
    });
    renderPublicCourses(filtered, containerId, isHomepage);
}
