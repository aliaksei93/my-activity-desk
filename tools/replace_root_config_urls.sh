#!/usr/bin/env sh

REMOTE_URLS=""

if [ -n "$WEB_APP_BOARD_REMOTE_URL" ]; then
  find '/usr/share/nginx/html' -name 'platform.manifest.json' -exec sed -i -e 's|http://localhost:4201|'"$WEB_APP_BOARD_REMOTE_URL"'|g' {} \;
  REMOTE_URLS="$REMOTE_URLS $WEB_APP_BOARD_REMOTE_URL"
fi

if [ -n "$WEB_APP_PROFILE_REMOTE_URL" ]; then
  find '/usr/share/nginx/html' -name 'platform.manifest.json' -exec sed -i -e 's|http://localhost:4202|'"$WEB_APP_PROFILE_REMOTE_URL"'|g' {} \;
  REMOTE_URLS="$REMOTE_URLS $WEB_APP_PROFILE_REMOTE_URL"
fi

if [ -n "$WEB_APP_NOTES_REMOTE_URL" ]; then
  find '/usr/share/nginx/html' -name 'platform.manifest.json' -exec sed -i -e 's|http://localhost:4203|'"$WEB_APP_NOTES_REMOTE_URL"'|g' {} \;
  REMOTE_URLS="$REMOTE_URLS $WEB_APP_NOTES_REMOTE_URL"
fi

sed -i 's|API_URL_TO_REPLACE|'"$WEB_APP_API_BASE_URL"'|g' /etc/nginx/nginx.conf
sed -i 's|BOARD_URL_TO_REPLACE|'"$REMOTE_URLS"'|g' /etc/nginx/nginx.conf

nginx -g "daemon off;"
