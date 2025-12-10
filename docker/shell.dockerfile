# Stage 1: build Angular
FROM node:22.19.0-alpine AS build

ARG APP_NAME=shell
ARG WEB_APP_API_BASE_URL
ARG WEB_APP_ENV_TARGET_PATH=./apps/angular/shell/src/environments/environment.ts

ENV WEB_APP_API_BASE_URL "$WEB_APP_API_BASE_URL"
ENV WEB_APP_ENV_TARGET_PATH "$WEB_APP_ENV_TARGET_PATH"

WORKDIR /repo

# dependencies
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
COPY apps ./apps
#COPY libs ./libs
#COPY docker ./docker
COPY nginx ./nginx
COPY tools ./tools

RUN npm ci

RUN cp ./tools/set-env.ts ./set-env.ts
RUN npx ts-node --transpile-only --compiler-options '{"module":"CommonJS"}' ./set-env.ts --trace-warnings

# build app
RUN npx nx build ${APP_NAME} --configuration=production

# Stage 2: serve with nginx
FROM nginx:alpine

ARG APP_NAME=shell

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /repo/nginx/shell.nginx.conf /etc/nginx/nginx.conf
COPY --from=build /repo/dist/apps/angular/${APP_NAME} /usr/share/nginx/html/
COPY --from=build /repo/tools/replace_api_url.sh /

EXPOSE 80

CMD ["sh", "replace_api_url.sh"]
