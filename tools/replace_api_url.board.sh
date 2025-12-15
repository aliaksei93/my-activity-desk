#!/usr/bin/env sh

echo "$WEB_APP_API_BASE_URL"

# environment.ts replacements
find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,WEB_APP_API_BASE_URL_TO_REPLACE,'"$WEB_APP_API_BASE_URL"',g' {} \;

# nginx.conf replacements
sed -i 's|API_URL_TO_REPLACE|'"$WEB_APP_API_BASE_URL"'|g' /etc/nginx/nginx.conf

nginx -g "daemon off;"
