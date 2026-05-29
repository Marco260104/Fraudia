const fs = require('fs');
const path = require('path');

// 1. Append DemoPage CSS to index.css
const indexCssPath = path.join(__dirname, 'src', 'index.css');
const demoCssPath = path.join(__dirname, 'src', 'modules', 'demo', 'DemoPage.css');

if (fs.existsSync(demoCssPath)) {
    const demoCss = fs.readFileSync(demoCssPath, 'utf8');
    let indexCss = fs.readFileSync(indexCssPath, 'utf8');
    
    // Add it only if not already added
    if (!indexCss.includes('/* DemoPage Premium Light Styles */')) {
        // We will also enforce padding on the layout to ensure it looks like a modern app
        const extraLayoutCss = `\n
/* ENFORCING PRO LAYOUT */
.dashboard-layout {
  padding: 14px !important;
  gap: 14px !important;
  max-width: 100vw;
  overflow-x: hidden;
}
`;
        fs.writeFileSync(indexCssPath, indexCss + '\n\n' + demoCss + extraLayoutCss, 'utf8');
    }
}

// 2. Fix DemoPage.tsx
const demoPagePath = path.join(__dirname, 'src', 'modules', 'demo', 'DemoPage.tsx');
let demoTsx = fs.readFileSync(demoPagePath, 'utf8');

// Remove DemoPage.css import
demoTsx = demoTsx.replace("import './DemoPage.css'\n", "");

// Replace dashboard-assistant with the blue link
const blueCard = `
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
`;

const sectionRegex = /[\r\n\s]*<section className="dashboard-assistant"[\s\S]*?<\/section>/g;
if (sectionRegex.test(demoTsx)) {
    demoTsx = demoTsx.replace(sectionRegex, '');
    
    if (demoTsx.includes('</aside>')) {
        demoTsx = demoTsx.replace('</aside>', blueCard + '        </aside>');
    }
}

// Make sure Link is imported
if (!demoTsx.includes('import { Link }')) {
    demoTsx = "import { Link } from 'react-router-dom';\n" + demoTsx;
}

fs.writeFileSync(demoPagePath, demoTsx, 'utf8');
console.log('Fixed DemoPage styling and sidebar card');
