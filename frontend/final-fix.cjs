const fs = require('fs');
const path = require('path');

const blueCard = `
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
`;

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

    // 1. Remove dashboard-assistant if it exists
    content = content.replace(/[\r\n\s]*<section className="dashboard-assistant"[\s\S]*?<\/section>/g, '');
    
    // 2. Remove sidebar-assistant-card Link if it exists (so we can freshly inject it)
    content = content.replace(/[\r\n\s]*<Link to="\/asistente" className="sidebar-assistant-card"[\s\S]*?<\/Link>/g, '');

    // 3. Inject blueCard before </aside>
    if (content.includes('</aside>')) {
        content = content.replace('</aside>', blueCard + '        </aside>');
    }

    // 4. Fix Duplicate Link Imports
    let lines = content.split('\n');
    let linkCount = 0;
    lines = lines.filter(line => {
        if (line.includes("import { Link }") || line.includes('import { Link, useLocation }')) {
            linkCount++;
            if (linkCount > 1) return false;
        }
        return true;
    });
    content = lines.join('\n');

    // 5. Safely add ShieldCheck to lucide-react import
    if (content.includes('lucide-react') && !content.includes('ShieldCheck')) {
        // Find the last item before } from 'lucide-react'
        content = content.replace(/([a-zA-Z0-9_]+)(\s*)\n(\s*)\} from 'lucide-react'/, "$1,\n$3ShieldCheck\n$3} from 'lucide-react'");
    }

    // Double check for duplicate commas like `Wrench,,`
    content = content.replace(/,,/g, ',');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', relPath);
}
