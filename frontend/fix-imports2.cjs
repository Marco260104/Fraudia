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

    // Fix duplicate Link import
    let lines = content.split('\n');
    let linkCount = 0;
    lines = lines.filter(line => {
        if (line.includes("import { Link } from 'react-router-dom'") || line.includes('import { Link } from "react-router-dom"')) {
            linkCount++;
            if (linkCount > 1) return false;
        }
        return true;
    });
    content = lines.join('\n');

    // Fix missing ShieldCheck import
    if (!content.includes('ShieldCheck') || (content.match(/ShieldCheck/g) || []).length === 1) {
        if (content.includes('lucide-react')) {
            content = content.replace("} from 'lucide-react'", "  ShieldCheck\n} from 'lucide-react'");
        } else if (content.includes('@phosphor-icons/react')) {
            content = content.replace("} from '@phosphor-icons/react'", "  ShieldCheck,\n} from '@phosphor-icons/react'");
        } else {
             // Just add phosphor icons import if not there
             content = "import { ShieldCheck } from '@phosphor-icons/react';\n" + content;
        }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed imports in', relPath);
}
