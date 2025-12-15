const { writeFile } = require('fs');
const path = require('path');

const envTargetPath = './apps/angular/board/src/environments/environment.ts';

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
