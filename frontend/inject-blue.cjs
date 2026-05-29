const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');

const blueCard = `
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} weight="fill" /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
`;

const activeCard = `
          <div className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px', cursor: 'default' }}>
            <div className="sac-icon"><ShieldCheck size={24} weight="fill" /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 1, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
                Chat Activo
              </p>
            </div>
          </div>
`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
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
            
            // Same for div active card
            const divRegex = /[\r\n\s]*<div className="sidebar-assistant-card"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
            if (divRegex.test(content)) {
                content = content.replace(divRegex, '');
                modified = true;
            }

            // Now inject the new card right before </aside>
            if (fullPath.includes('AssistantPage.tsx')) {
                content = content.replace('</aside>', activeCard + '        </aside>');
                modified = true;
            } else if (content.includes('</aside>')) {
                content = content.replace('</aside>', blueCard + '        </aside>');
                modified = true;
            }

            if (modified) {
                // Ensure ShieldCheck is imported from Phosphor or Lucide
                if (content.includes('@phosphor-icons/react') && !content.includes('ShieldCheck')) {
                    content = content.replace("} from '@phosphor-icons/react'", "  ShieldCheck,\n} from '@phosphor-icons/react'");
                } else if (content.includes('lucide-react') && !content.includes('ShieldCheck')) {
                    content = content.replace("} from 'lucide-react'", "  ShieldCheck\n} from 'lucide-react'");
                }

                // If lucide, we need to remove weight="fill"
                if (content.includes('lucide-react') && !fullPath.includes('AssistantPage.tsx')) {
                    content = content.replace(/<ShieldCheck size=\{24\} weight="fill" \/>/g, '<ShieldCheck size={24} />');
                }

                if (!content.includes("import { Link } from 'react-router-dom'") && !content.includes('import { Link } from "react-router-dom"') && !fullPath.includes('AssistantPage.tsx')) {
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
