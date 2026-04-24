import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(toolsDir, '..');

export const projects = {
  board: {
    appPath: 'apps/angular/board',
    publicPath: 'apps/angular/board/public',
    framework: 'angular',
    role: 'remote',
  },
  'root-config': {
    appPath: 'apps/platform/root-config',
    publicPath: 'apps/platform/root-config/public',
    framework: 'agnostic',
    role: 'host',
  },
  profile: {
    appPath: 'apps/react/profile',
    publicPath: 'apps/react/profile/public',
    framework: 'react',
    role: 'remote',
  },
  notes: {
    appPath: 'apps/vue/notes',
    publicPath: 'apps/vue/notes/public',
    framework: 'vue',
    role: 'remote',
  },
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const readGitValue = (command) => {
  try {
    return execSync(command, { cwd: workspaceRoot, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
};

export const createVersion = (projectName, explicitCommit) => {
  const project = projects[projectName];

  if (!project) {
    const availableProjects = Object.keys(projects).join(', ');
    throw new Error(`Unknown project "${projectName}". Available projects: ${availableProjects}`);
  }

  const packageJson = readJson(path.resolve(workspaceRoot, 'package.json'));
  const commitFullHash =
    explicitCommit ||
    process.env.GIT_COMMIT ||
    process.env.GITHUB_SHA ||
    readGitValue('git rev-parse HEAD') ||
    'unknown';
  const commitHash = commitFullHash === 'unknown' ? 'unknown' : commitFullHash.slice(0, 7);
  const gitRef =
    process.env.GIT_REF ||
    process.env.GITHUB_REF_NAME ||
    process.env.GITHUB_REF ||
    readGitValue('git rev-parse --abbrev-ref HEAD') ||
    'unknown';

  return {
    schemaVersion: 1,
    name: projectName,
    role: project.role,
    framework: project.framework,
    appPath: project.appPath,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    commitHash,
    commitFullHash,
    gitRef,
    buildDate: new Date().toISOString(),
  };
};

export const writeVersionFile = (projectName, explicitCommit) => {
  const project = projects[projectName];

  if (!project) {
    const availableProjects = Object.keys(projects).join(', ');
    throw new Error(`Unknown project "${projectName}". Available projects: ${availableProjects}`);
  }

  const outDir = path.resolve(workspaceRoot, project.publicPath);
  const outFile = path.join(outDir, 'version.json');
  const version = createVersion(projectName, explicitCommit);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(version, null, 2)}\n`, 'utf8');

  return outFile;
};

export const createVersionPlugin = (projectName) => ({
  name: 'my-activity-desk-version',
  buildStart() {
    writeVersionFile(projectName);
  },
  configureServer() {
    writeVersionFile(projectName);
  },
});

export { workspaceRoot };
