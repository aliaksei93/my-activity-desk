const path = require('path');
const { projects, workspaceRoot, writeVersionFile } = require('./version-metadata');

const projectName = process.argv[2];
const explicitCommit = process.argv[3];

if (!projectName || !projects[projectName]) {
  const availableProjects = Object.keys(projects).join(', ');
  console.error(`Usage: node tools/set-version.js <${availableProjects}> [commit]`);
  process.exit(1);
}

const outFile = writeVersionFile(projectName, explicitCommit);

console.log(`Version file written for ${projectName}: ${path.relative(workspaceRoot, outFile)}`);
