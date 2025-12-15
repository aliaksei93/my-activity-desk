const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appName = process.argv[2];
const outDir = path.join('apps', appName, 'src', 'environments');
const outFile = path.join(outDir, 'version.ts');

let commitHash = process.argv[3] || process.env.GIT_COMMIT;

if (!commitHash) {
  try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim(); // [1]
  } catch (e) {
    console.warn('WARN: cannot get git commit hash, using "unknown".', e.message);
    commitHash = 'unknown';
  }
}

const buildDate = new Date().toISOString();

fs.mkdirSync(outDir, { recursive: true });

const content = `
export const commitHash = '${commitHash}';
export const buildDate = '${buildDate}';
`;

fs.writeFileSync(outFile, content, { encoding: 'utf8' });
console.log(`Version file written for ${appName}:`, { commitHash, buildDate });
