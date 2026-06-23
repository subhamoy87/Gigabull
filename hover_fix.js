const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Current inactive classes
const oldInactive = 'tab-btn flex items-center px-4 py-3 md:py-2.5 mb-1 rounded-lg text-[0.9rem] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-left w-full whitespace-nowrap';

// New inactive classes (adding border-transparent, and hover equivalents of the active styling)
const newInactive = 'tab-btn flex items-center px-4 py-3 md:py-2.5 mb-1 rounded-lg text-[0.9rem] font-medium text-slate-500 border-l-4 md:border-l-0 md:border-r-4 border-transparent hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-600 transition-all text-left w-full whitespace-nowrap';

// Replace in HTML
html = html.replace(new RegExp(oldInactive.replace(/[.*+?^$\{\}\(\)\|\[\]\\]/g, '\\$&'), 'g'), newInactive);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done');
