const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');

const blueCard = `
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            // ONLY process the restored files
            const restoredFiles = ['InsuredsPage.tsx', 'MapSiniestrosPage.tsx', 'NarrativesPage.tsx', 'TalleresPage.tsx', 'VehiclesPage.tsx'];
            if (!restoredFiles.some(f => fullPath.endsWith(f))) continue;

            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove existing dashboard-assistant section
            const sectionRegex = /[\r\n\s]*<section className="dashboard-assistant"[\s\S]*?<\/section>/g;
            if (sectionRegex.test(content)) {
                content = content.replace(sectionRegex, '');
                modified = true;
            }

            // Also remove any existing Link to /asistente in case there's residue
            const linkRegex = /[\r\n\s]*<Link to="\/asistente" className="sidebar-assistant-card"[\s\S]*?<\/Link>/g;
            if (linkRegex.test(content)) {
                content = content.replace(linkRegex, '');
                modified = true;
            }

            // Now inject the new card right before </aside>
            if (content.includes('</aside>')) {
                content = content.replace('</aside>', blueCard + '        </aside>');
                modified = true;
            }

            if (modified) {
                // For lucide-react, add ShieldCheck safely
                if (content.includes('lucide-react')) {
                    if (!content.includes('ShieldCheck')) {
                        content = content.replace(/(\s+)([A-Za-z0-9_]+)(\s*)\n(\s*)\} from 'lucide-react'/, "$1$2,$1ShieldCheck$3\n$4} from 'lucide-react'");
                    }
                }

                if (!content.includes("import { Link }") && !content.includes('import { Link }')) {
                    content = "import { Link } from 'react-router-dom'\n" + content;
                }

                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDir(modulesDir);
console.log('Done');
