const { writeFile } = require('fs');
const path = require('path');

const targetPath = process.env.WEB_APP_ENV_TARGET_PATH;

const envConfigFile = `
export const environment = {
  apiBaseUrl: 'WEB_APP_API_BASE_URL_TO_REPLACE',
};
`;

const resolvedPath = path.resolve(targetPath);

writeFile(resolvedPath, envConfigFile, function (err: any) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Output generated at ${targetPath}`);
});
