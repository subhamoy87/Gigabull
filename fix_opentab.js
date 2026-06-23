const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldOpenTab = `function openTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId)) {
                    b.classList.add('active');
                }
            });
            document.getElementById(tabId).classList.add('active');
        }`;

const newOpenTab = `function openTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active', 'font-bold', 'text-indigo-700', 'bg-indigo-50', 'border-indigo-600');
                b.classList.add('font-medium', 'text-slate-500', 'border-transparent');
                if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId)) {
                    b.classList.add('active', 'font-bold', 'text-indigo-700', 'bg-indigo-50', 'border-indigo-600');
                    b.classList.remove('font-medium', 'text-slate-500', 'border-transparent');
                }
            });
            document.getElementById(tabId).classList.add('active');
        }`;

html = html.replace(oldOpenTab, newOpenTab);

fs.writeFileSync('index.html', html, 'utf8');
