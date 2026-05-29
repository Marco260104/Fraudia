const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

try {
    // Just reset the specific files from git that got mangled, except for my changes!
    // Actually, I can't reset them easily if they had my link inject changes from earlier!
    // Wait, let's look at the git status.
    console.log(execSync('git status').toString());
} catch (e) {
    console.log(e);
}
