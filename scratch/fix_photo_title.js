const fs = require('fs');

let fga = fs.readFileSync('src/components/FloorGuideAccordion.tsx', 'utf8');

const regex = /<span className="text-sm sm:text-base font-extrabold text-slate-700 truncate max-w-full text-center mt-1">/;
const replacement = '<span className="text-[11px] sm:text-sm font-extrabold text-slate-700 break-keep line-clamp-2 max-w-full text-center mt-1 leading-tight">';

if (regex.test(fga)) {
  fga = fga.replace(regex, replacement);
  fs.writeFileSync('src/components/FloorGuideAccordion.tsx', fga, 'utf8');
  console.log('Successfully updated photo title truncate via regex');
} else {
  console.log('Regex did not match');
}
