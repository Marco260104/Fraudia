const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove sidebar-assistant-card block completely
            const cardRegex = /[\r\n\s]*<Link to="\/asistente" className="sidebar-assistant-card">[\s\S]*?<\/Link>/g;
            if (cardRegex.test(content)) {
                content = content.replace(cardRegex, '');
                modified = true;
            }

            // Replace <button className="dashboard-assistant-cta"> with Link
            const btnRegex = /<button type="button" className="dashboard-assistant-cta">([\s\S]*?)<\/button>/g;
            if (btnRegex.test(content)) {
                content = content.replace(btnRegex, '<Link to="/asistente" className="dashboard-assistant-cta">$1</Link>');
                modified = true;
            }
            
            // TalleresPage has a specific button:
            const btnRegex2 = /<button className="btn" type="button" style={{ width: '100%', justifyContent: 'space-between' }}>([\s\S]*?)<\/button>/g;
            if (btnRegex2.test(content)) {
                content = content.replace(btnRegex2, '<Link to="/asistente" className="btn" style={{ width: "100%", justifyContent: "space-between", textDecoration: "none" }}>$1</Link>');
                modified = true;
            }

            if (modified) {
                // ensure Link is imported if we just added it
                if (!content.includes('import { Link } from \'react-router-dom\'') && !content.includes('import { Link } from "react-router-dom"')) {
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
