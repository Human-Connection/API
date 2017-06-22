FROM node:8-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Grzegorz Leoniec" Version="1.0" Maintainer="Grzegorz Leoniec (greg@app-interactive.de)"

# update unix packages
RUN apk update && apk upgrade
RUN rm -rf /var/cache/apk/*

# copy the project
RUN mkdir -p /var/www/
COPY . /var/www/
WORKDIR /var/www/

# expose the app port
EXPOSE 8080

# set environment variables
# ENV NPM_CONFIG_PRODUCTION=false
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# buld application
RUN npm install --production

CMD [ "node", "server/index.js" ]