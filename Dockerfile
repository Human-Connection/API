FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-api-feathers" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# update unix packages
RUN apk update && apk upgrade
RUN rm -rf /var/cache/apk/*

# expose the app port
EXPOSE 3030

# set environment variables
# ENV NPM_CONFIG_PRODUCTION=false
# ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV API_PORT=3030

# start the application in a autohealing cluster
#CMD NODE_ENV=production pm2 start server/index.js -n api -i 0 --attach
# as we have issues with pm2 currently in conjunction with nuxt, we use the standard approach here
CMD NODE_ENV=production node server/index.js

# create working directory
RUN mkdir -p /var/www/
WORKDIR /var/www/

# install app dependencies
COPY package.json /var/www/
COPY yarn.lock /var/www/
RUN yarn install --frozen-lockfile --non-interactive

# copy the code to the docker image
COPY . /var/www/
