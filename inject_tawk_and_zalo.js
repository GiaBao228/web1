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

const tawkScript = `\t<!--Start of Tawk.to Script-->
\t<script type="text/javascript">
\tvar Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
\t(function(){
\tvar s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
\ts1.async=true;
\ts1.src='https://embed.tawk.to/676cb763af5bfec1dbe201b1/1ig0aoo0n';
\ts1.charset='UTF-8';
\ts1.setAttribute('crossorigin','*');
\ts0.parentNode.insertBefore(s1,s0);
\t})();
\t</script>
\t<!--End of Tawk.to Script-->
`;

const cssLink = '\t<link rel="stylesheet" type="text/css" href="styles/zalo_qr_modal.css">';

filesToUpdate.forEach(fileName => {
    const filePath = path.join('d:/web-main', fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File not found: ${fileName}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add Tawk.to script before </body> if not already present
    if (!content.includes('tawk.to')) {
        const bodyEndIndex = content.indexOf('</body>');
        if (bodyEndIndex !== -1) {
            content = content.substring(0, bodyEndIndex) + tawkScript + '\n' + content.substring(bodyEndIndex);
            modified = true;
            console.log(`✅ Added Tawk.to to ${fileName}`);
        }
    } else {
        console.log(`ℹ️ ${fileName} already has Tawk.to`);
    }

    // Add Zalo QR modal CSS in head if not already present
    if (!content.includes('zalo_qr_modal.css')) {
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex !== -1) {
            content = content.substring(0, headEndIndex) + cssLink + '\n' + content.substring(headEndIndex);
            modified = true;
            console.log(`✅ Added Zalo QR CSS to ${fileName}`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('\n🚀 Integration complete!');
