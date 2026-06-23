const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject Tailwind CDN with preflight: false
const cdnScript = `    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            corePlugins: { preflight: false }
        }
    </script>
`;
if (!html.includes('cdn.tailwindcss.com')) {
    html = html.replace('<style>', cdnScript + '    <style>');
}

// 2. Remove Custom Form CSS Rules
// The custom CSS rules we want to remove span from /* Form Controls */ to /* Previews & Panels */
const removeRegex = /\/\* Form Controls \*\/[\s\S]*?\/\* Previews & Panels \*\//;
html = html.replace(removeRegex, '/* Previews & Panels */');


// 3. Add Tailwind Classes to Form Elements
// First, update labels
html = html.replace(/<label(.*?)>/g, (match, p1) => {
    if (p1.includes('class=')) return match;
    return `<label${p1} class="block text-[0.8rem] font-bold uppercase text-slate-500 mb-1">`;
});

// Update inputs
const inputClass = 'w-full p-3 border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[0.95rem] text-slate-700 placeholder-slate-400 bg-slate-50 hover:bg-white transition-colors shadow-sm';
const tableInputClass = 'w-full p-2 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-colors';

html = html.replace(/<input type="text"/g, `<input type="text" class="${inputClass}"`);
html = html.replace(/<input type="date"/g, `<input type="date" class="${inputClass}"`);
html = html.replace(/<input type="number"/g, `<input type="number" class="${inputClass}"`);
html = html.replace(/<select/g, `<select class="${inputClass}"`);
html = html.replace(/<textarea/g, `<textarea class="${inputClass}"`);
html = html.replace(/<input type="file"/g, `<input type="file" class="${inputClass}"`);

// Since inputs inside the table should be smaller, let's fix them up.
// Find all <td...> <input... class="..."> and replace class with tableInputClass
html = html.replace(/(<td[^>]*>.*?<input[^>]+class=")[^"]+(")/g, `$1${tableInputClass}$2`);


// 4. Update Buttons
html = html.replace(/class="btn btn-add"/g, 'class="btn-add px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-md shadow hover:shadow-md transition-all flex items-center gap-2 mb-6"');
html = html.replace(/class="btn btn-remove"/g, 'class="btn-remove bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-rose-200 hover:border-rose-500"');
html = html.replace(/class="btn"/g, 'class="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 md:py-2.5 px-6 rounded-md shadow-md hover:shadow-lg transition-all"');


// 5. Update Javascript Strings for addRow()
html = html.replace(/row\.innerHTML = `(.*?)`;/g, (match, innerHTML) => {
    let replaced = innerHTML.replace(new RegExp(inputClass, 'g'), tableInputClass);
    replaced = replaced.replace(/class="btn btn-remove"/g, 'class="btn-remove bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-rose-200 hover:border-rose-500"');
    
    // Some js strings might just have `<input type="text" class="ci_p_marks" value="">` without the full inputClass
    // because they were simple strings. We need to insert tableInputClass into them.
    replaced = replaced.replace(/<input type="text" class="([^"]+)"/g, `<input type="text" class="$1 ${tableInputClass}"`);
    replaced = replaced.replace(/<input type="number" class="([^"]+)"/g, `<input type="number" class="$1 ${tableInputClass}"`);
    replaced = replaced.replace(/<input type="number" step="0.01" class="([^"]+)"/g, `<input type="number" step="0.01" class="$1 ${tableInputClass}"`);

    return `row.innerHTML = \`${replaced}\`;`;
});


// 6. Fix Form Groups
// We want to make sure the form labels have some margin below them and inputs take full width.
// Our new inputClass uses w-full, but since the parent .form-group had display: flex; flex-direction: column; from custom CSS, and we deleted it,
// we should re-add flex col to form-groups in HTML.
html = html.replace(/class="form-group"/g, 'class="flex flex-col"');
html = html.replace(/class="form-group full-width"/g, 'class="flex flex-col" style="grid-column: 1 / -1;"');


fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated forms with Tailwind CSS!');
