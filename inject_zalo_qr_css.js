const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'courses.html',
    'categories.html',
    'news.html',
    'elements.html',
    'contact.html',
    'cart.html',
    'course_detail.html',
    'teachers.html'
];

const cssLink = '\t<link rel="stylesheet" type="text/css" href="styles/zalo_qr_modal.css">';

filesToUpdate.forEach(fileName => {
    const filePath = path.join('d:/web-main', fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File not found: ${fileName}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add CSS link in head if not already present
    if (!content.includes('zalo_qr_modal.css')) {
        // Find </head> tag and insert before it
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex !== -1) {
            content = content.substring(0, headEndIndex) + cssLink + '\n' + content.substring(headEndIndex);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${fileName}`);
    } else {
        console.log(`ℹ️ ${fileName} already has zalo QR modal CSS`);
    }
});

console.log('🚀 Zalo QR modal CSS integration complete!');
