const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove preflight: false
html = html.replace(/<script>\s*tailwind\.config = \{\s*corePlugins: \{ preflight: false \}\s*\}\s*<\/script>/, '');

// 2. Remove layout CSS
// Let's remove from body { down to /* Form Controls */
// Since we deleted /* Form Controls */, we can remove up to /* Dashboard Cards */
const layoutCssRegex = /body\s*\{[\s\S]*?\/\* Dashboard Cards \*\//;
html = html.replace(layoutCssRegex, '/* Dashboard Cards */');

// Also remove the Dashboard Cards CSS
const dashboardCssRegex = /\/\* Dashboard Cards \*\/[\s\S]*?(?=\/\* Previews & Panels \*\/)/;
html = html.replace(dashboardCssRegex, '');

// And remove the responsive design css
const responsiveCssRegex = /\/\* Responsive Design \*\/[\s\S]*?(?=\/\* PDF TEMPLATE STYLES \*\/)/;
html = html.replace(responsiveCssRegex, '');

// And remove Previews & Panels css
const previewsCssRegex = /\/\* Previews & Panels \*\/[\s\S]*?(?=\/\* PDF TEMPLATE STYLES \*\/)/;
html = html.replace(previewsCssRegex, '');

// And the base root variables since Tailwind handles it
const rootCssRegex = /:root\s*\{[\s\S]*?\}\s*/;
html = html.replace(rootCssRegex, '');

// 3. Replace body tag
html = html.replace('<body>', '<body class="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">');

// 4. Replace sidebar
html = html.replace('<div class="sidebar">', '<div class="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">');
html = html.replace('<h2>Shivansh International</h2>', `
            <div class="p-4 border-b border-slate-200 flex items-center gap-3">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg shrink-0 flex items-center justify-center text-white font-bold">
                    S
                </div>
                <h2 class="font-bold text-slate-800 tracking-tight whitespace-nowrap m-0 text-xl">Shivansh Int.</h2>
            </div>
            <div class="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2 mt-4 shrink-0">Menu</div>
`);

// 5. Replace tab buttons container
html = html.replace('<button class="tab-btn active" onclick="openTab(\'dashboard\')">Dashboard</button>', '<div class="flex-none md:flex-1 p-2 md:p-3 flex md:flex-col gap-1 md:gap-0 md:space-y-1 overflow-x-auto custom-scrollbar">\n        <button class="tab-btn active" onclick="openTab(\'dashboard\')">Dashboard</button>');
html = html.replace('<button class="tab-btn" onclick="openTab(\'purchase\')">Purchase Order</button>', '<button class="tab-btn" onclick="openTab(\'purchase\')">Purchase Order</button>\n        </div>');

// 6. Update tab-btn classes
const oldBtnClass = 'tab-btn';
const newBtnClass = 'tab-btn flex items-center px-4 py-3 md:py-2.5 mb-1 rounded-lg text-[0.9rem] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-left w-full whitespace-nowrap';
const newActiveBtnClass = 'tab-btn active flex items-center px-4 py-3 md:py-2.5 mb-1 rounded-lg text-[0.9rem] font-medium text-indigo-700 bg-indigo-50 border-l-4 md:border-l-0 md:border-r-4 border-indigo-600 transition-all text-left w-full whitespace-nowrap';

html = html.replace(/class="tab-btn"/g, `class="${newBtnClass}"`);
html = html.replace(/class="tab-btn active"/g, `class="${newActiveBtnClass}"`);

// 7. Replace main content and wrapper
html = html.replace('<div class="main-content">', '<div class="flex-1 p-4 md:p-8 overflow-y-auto">\n        <div class="max-w-7xl mx-auto">');
html = html.replace('<div id="pdf-render-wrapper">', '</div>\n    </div>\n\n    <div id="pdf-render-wrapper">');

// 8. Replace Dashboard cards HTML
html = html.replace(/class="dashboard-cards"/g, 'class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5"');
html = html.replace(/class="dash-card"/g, 'class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-start"');
html = html.replace(/class="dash-icon"/g, 'class="text-3xl mb-4 bg-indigo-50 text-indigo-600 p-3 rounded-lg"');

// 9. Update .tab-content classes
html = html.replace(/class="tab-content active"/g, 'class="tab-content active bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8"');
html = html.replace(/class="tab-content"/g, 'class="tab-content bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8"');
html = html.replace(/class="tab-content /g, 'class="tab-content bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8 ');

// 10. Update h3, h4
html = html.replace(/<h3>/g, '<h3 class="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">');
html = html.replace(/<h4>/g, '<h4 class="text-[1.05rem] font-bold text-slate-800 border-b border-slate-100 pb-2 mt-8 mb-4">');

// 11. Add CSS for tab-content since we removed it
const extraStyle = `
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .sig_preview_box { max-height: 80px; margin-top: 12px; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 8px; display: none; background-color: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
html = html.replace('<style>', '<style>' + extraStyle);

// 12. Fix form-grid
html = html.replace(/class="form-grid"/g, 'class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"');

// 13. Fix Live Totals Panel
html = html.replace(/class="live-totals-panel"/g, 'class="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 w-full md:max-w-sm ml-0 md:ml-auto mt-6 mb-6 shadow-sm"');
html = html.replace(/class="totals-row"/g, 'class="flex justify-between text-[1.05rem] font-semibold text-slate-500 mb-3"');
html = html.replace(/class="totals-row grand"/g, 'class="flex justify-between text-xl font-bold text-slate-800 border-t border-slate-200 pt-4 mt-2"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated layout with Tailwind CSS!');
