#!/usr/bin/env sh

echo "$WEB_APP_API_BASE_URL"
echo "$WEB_APP_BOARD_REMOTE_URL"

# environment.ts replacements
find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,WEB_APP_API_BASE_URL_TO_REPLACE,'"$WEB_APP_API_BASE_URL"',g' {} \;

# JS/manifest: replace board URL (remote)
if [ -n "$WEB_APP_BOARD_REMOTE_URL" ]; then
  find '/usr/share/nginx/html' -name '*.js' -o -name 'module-federation.manifest.json' -exec \
    sed -i -e 's,WEB_APP_BOARD_REMOTE_URL_TO_REPLACE,'"$WEB_APP_BOARD_REMOTE_URL"',g' {} \;
fi

# nginx.conf replacements
sed -i 's|API_URL_TO_REPLACE|'"$WEB_APP_API_BASE_URL"'|g' /etc/nginx/nginx.conf

nginx -g "daemon off;"
