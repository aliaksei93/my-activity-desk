# Stage 1: build Angular
FROM node:22.19.0-alpine AS build

ARG WEB_APP_API_BASE_URL

ENV WEB_APP_API_BASE_URL=$WEB_APP_API_BASE_URL

WORKDIR /repo

# dependencies
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
COPY apps ./apps
COPY libs ./libs
COPY nginx ./nginx
COPY tools ./tools

RUN npm ci

# build app
RUN npx nx build board --configuration=production

# Stage 2: serve with nginx
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /repo/nginx/web.nginx.conf /etc/nginx/nginx.conf
COPY --from=build /repo/dist/apps/angular/board /usr/share/nginx/html/
COPY --from=build /repo/tools/replace_api_url.board.sh /

EXPOSE 80

CMD ["sh", "replace_api_url.board.sh"]
