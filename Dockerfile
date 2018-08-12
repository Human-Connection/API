FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-api-feathers" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# expose the app port
EXPOSE 3030
# chrome debugging
EXPOSE 9229

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

# start the application in a autohealing cluster
# NOTE: quick fix for server issues, restart api when reaching max of 300 MB Memory Usage (happens in conjunction with 100% CPU Usage)
# TODO: find better way of dealing with that issue
CMD ["pm2", "start", "server/index.js", "-n", "api", "--attach", "--max-memory-restart", "1024M"]
