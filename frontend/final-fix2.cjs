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

    // Make sure useLocation is available
    if (content.includes('useLocation(') && !content.includes('useLocation }')) {
        content = "import { useLocation } from 'react-router-dom';\n" + content;
    }

    // Make sure Link is available
    if (content.includes('<Link') && !content.includes('Link }')) {
        content = "import { Link } from 'react-router-dom';\n" + content;
    }

    // Make sure ShieldCheck is available
    if (content.includes('<ShieldCheck') && !content.includes('ShieldCheck }')) {
        if (content.includes('lucide-react')) {
            content = "import { ShieldCheck } from 'lucide-react';\n" + content;
        } else {
            content = "import { ShieldCheck } from '@phosphor-icons/react';\n" + content;
        }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed imports easily in', relPath);
}
