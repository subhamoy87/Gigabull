const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Clean up duplicate tab-content styling that happened from double replacement
const duplicateClass = ' bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8';
html = html.replace(new RegExp(duplicateClass + duplicateClass, 'g'), duplicateClass);
html = html.replace(/class="tab-content bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8 active bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8"/g, 'class="tab-content active' + duplicateClass + '"');
html = html.replace(/class="tab-content bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8 bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8"/g, 'class="tab-content' + duplicateClass + '"');

fs.writeFileSync('index.html', html, 'utf8');
