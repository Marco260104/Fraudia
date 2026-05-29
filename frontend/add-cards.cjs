const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'modules');

const standardCard = `
          <section className="dashboard-assistant">
            <div className="dashboard-assistant-head">
              <ShieldCheck size={20} weight="bold" />
              <strong>IA Assistant</strong>
            </div>
            <p>Pregúntame sobre patrones, casos o cualquier análisis que necesites.</p>
            <Link to="/asistente" className="dashboard-assistant-cta">
              <span>Abrir chat</span>
              <span>→</span>
            </Link>
          </section>
`;

const activeCard = `
          <section className="dashboard-assistant" style={{ borderColor: 'var(--brand-blue)', background: 'var(--bg-secondary)' }}>
            <div className="dashboard-assistant-head">
              <ShieldCheck size={20} weight="bold" color="var(--brand-blue)" />
              <strong style={{ color: 'var(--brand-blue)' }}>IA Assistant</strong>
            </div>
            <p>Estás en el chat de inteligencia artificial.</p>
            <div className="dashboard-assistant-cta" style={{ background: 'transparent', color: 'var(--brand-blue)', cursor: 'default', justifyContent: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-blue)', display: 'inline-block' }}></span>
                Chat Activo
              </span>
            </div>
          </section>
`;

function fixFile(relPath, cardHtml, needsLink) {
    const fullPath = path.join(baseDir, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Inject card before </aside>
    if (!content.includes('className="dashboard-assistant"')) {
        content = content.replace('</aside>', cardHtml + '        </aside>');
    }

    // 2. Ensure ShieldCheck from phosphor
    if (content.includes('@phosphor-icons/react')) {
        if (!content.includes('ShieldCheck')) {
            content = content.replace("} from '@phosphor-icons/react'", "  ShieldCheck,\n} from '@phosphor-icons/react'");
        }
    }

    // 3. Ensure Link from react-router-dom
    if (needsLink) {
        if (!content.includes("import { Link } from 'react-router-dom'") && !content.includes('import { Link } from "react-router-dom"')) {
            content = "import { Link } from 'react-router-dom'\n" + content;
        }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', relPath);
}

fixFile('calculator/CalculatorPage.tsx', standardCard, true);
fixFile('reports/ReportsPage.tsx', standardCard, true);
fixFile('config/ConfigPage.tsx', standardCard, true);
fixFile('providers/ProvidersPage.tsx', standardCard, true);
fixFile('assistant/AssistantPage.tsx', activeCard, false);

console.log('Done');
