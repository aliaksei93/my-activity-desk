const { writeFile } = require('fs');
const path = require('path');

const envTargetPath = process.env.WEB_APP_ENV_TARGET_PATH;
const manifestTargetPath = process.env.WEB_APP_MANIFEST_TARGET_PATH;

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

if (manifestTargetPath) {
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
}
