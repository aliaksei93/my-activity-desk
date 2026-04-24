# Stage 1: build platform host
FROM node:22.19.0-alpine AS build

ARG GIT_COMMIT
ARG GIT_REF

ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_REF=$GIT_REF

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
RUN npx nx build root-config

# Stage 2: serve with nginx
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /repo/nginx/web.nginx.conf /etc/nginx/nginx.conf
COPY --from=build /repo/dist/apps/platform/root-config /usr/share/nginx/html/
COPY --from=build /repo/tools/replace_root_config_urls.sh /

EXPOSE 80

CMD ["sh", "replace_root_config_urls.sh"]
