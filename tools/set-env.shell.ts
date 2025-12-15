const { writeFile } = require('fs');
const path = require('path');

const envTargetPath = './apps/angular/shell/src/environments/environment.ts';
const manifestTargetPath = './apps/angular/shell/public/module-federation.manifest.json';

/* update environment file */
const envConfigFile = `
  export const environment = {
    apiBaseUrl: 'WEB_APP_API_BASE_URL_TO_REPLACE',
  };
  `;

const envResolvedPath = path.resolve(envTargetPath);

writeFile(envResolvedPath, envConfigFile, function (err: any) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`environment.ts output generated at ${envTargetPath}`);
});

/* update mf-manifest.json */
const manifestFile = `
  {
    "board": "WEB_APP_BOARD_REMOTE_URL_TO_REPLACE/mf-manifest.json"
  }
  `;

const manifestResolvedPath = path.resolve(manifestTargetPath);

writeFile(manifestResolvedPath, manifestFile, function (err: any) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`module-federation.manifest.json output generated at ${manifestTargetPath}`);
});
