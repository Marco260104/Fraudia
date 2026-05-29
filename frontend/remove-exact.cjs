const fs = require('fs');
const path = require('path');

function replaceExact(relPath, oldStr, newStr) {
    const fullPath = path.join(__dirname, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(fullPath, content, 'utf8');
}

// 1. Remove line 1 from Insureds, MapSiniestros, Talleres
replaceExact('src/modules/insureds/InsuredsPage.tsx', "import { ShieldCheck } from 'lucide-react';\n", "");
replaceExact('src/modules/map/MapSiniestrosPage.tsx', "import { ShieldCheck } from 'lucide-react';\n", "");
replaceExact('src/modules/talleres/TalleresPage.tsx', "import { ShieldCheck } from 'lucide-react';\n", "");

// 2. Fix NarrativesPage missing useLocation
replaceExact('src/modules/narratives/NarrativesPage.tsx', "import { Link } from 'react-router-dom';", "import { Link, useLocation } from 'react-router-dom';");

// 3. Fix VehiclesPage missing useLocation
replaceExact('src/modules/vehicles/VehiclesPage.tsx', "import { Link } from 'react-router-dom';", "import { Link, useLocation } from 'react-router-dom';");

console.log("Done");
