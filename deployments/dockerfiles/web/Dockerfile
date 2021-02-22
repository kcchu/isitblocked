FROM node:14-buster-slim

WORKDIR /src
COPY web /src
RUN yarn install &&\
    yarn build

FROM nginx:latest

COPY --from=0 /src/build /usr/share/nginx/html
COPY deployments/dockerfiles/web/default.conf.template /etc/nginx/templates/

ENV OBSERVER_ADDRESS=observer:9002