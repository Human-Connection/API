FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-api-feathers" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# update unix packages
RUN apk update && apk upgrade
RUN rm -rf /var/cache/apk/*
RUN yarn global add pm2

# create working directory
RUN mkdir -p /API
WORKDIR /API

# install app dependencies
COPY package.json /API
COPY yarn.lock /API
RUN yarn install --frozen-lockfile --non-interactive

# copy the code to the docker image
COPY . /API

# setup local configuration
COPY ./config/docker/* /API/config/

# expose the app port
EXPOSE 3030
EXPOSE 9229
