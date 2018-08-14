FROM node:alpine
LABEL Description="This image is used to start the hc-api-feathers" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# expose the app port
EXPOSE 3030

# create working directory
RUN mkdir -p /API
WORKDIR /API

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add python make g++

RUN yarn global add pm2

# install app dependencies
COPY package.json /API
COPY yarn.lock /API
RUN yarn install --frozen-lockfile --non-interactive

RUN apk del build-dependencies

# override configuration by instance name in docker container
ENV NODE_APP_INSTANCE=docker
# must be after `yarn install`
ENV NODE_ENV=production

# copy the code to the docker image
COPY . /API

# start the application in a autohealing cluster
# NOTE: quick fix for server issues, restart api when reaching max of 300 MB Memory Usage (happens in conjunction with 100% CPU Usage)
# TODO: find better way of dealing with that issue
CMD ["pm2", "start", "server/index.js", "-n", "api", "--attach", "--max-memory-restart", "1024M"]
