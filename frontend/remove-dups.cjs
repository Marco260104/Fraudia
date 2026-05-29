const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/modules/insureds/InsuredsPage.tsx',
    'src/modules/map/MapSiniestrosPage.tsx',
    'src/modules/narratives/NarrativesPage.tsx',
    'src/modules/talleres/TalleresPage.tsx',
    'src/modules/vehicles/VehiclesPage.tsx'
];

for (const relPath of filesToFix) {
    const fullPath = path.join(__dirname, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');

    let lines = content.split('\n');
    let linkCount = 0;
    let shieldCount = 0;
    
    lines = lines.filter(line => {
        if (line.match(/^import .*\{.*Link.*\}.*from 'react-router-dom'/)) {
            linkCount++;
            if (linkCount > 1) return false;
        }
        if (line.match(/^import .*\{.*ShieldCheck.*\}.*from/)) {
            shieldCount++;
            if (shieldCount > 1) return false; // remove standalone ShieldCheck import if we already have one
        }
        return true;
    });
    
    content = lines.join('\n');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Cleaned', relPath);
}
