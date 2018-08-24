<p align="center">
  <img align="center" src="https://human-connection.org/wp-content/uploads/2017/11/human-connection-logo.svg" alt="Human Connection" />
</p>


<p align="center">
  <a href="https://travis-ci.org/Human-Connection/API"><img src="https://img.shields.io/travis/Human-Connection/API/master.svg" alt="Build Status"></a>
  <a href="https://github.com/Human-Connection/WebApp/blob/develop/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green.svg" "MIT" /></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FHuman-Connection%2FAPI?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FHuman-Connection%2FAPI.svg?type=shield"/></a>
  <a href="https://discord.gg/NgVpvx9" alt="Discord Channel">
<img src="https://img.shields.io/discord/443107904757694465.svg" alt="Discord" /></a>
</p>

# Human-Connection API

The API for a better world. More information under [human-connection.org](https://human-connection.org)

> **Note:** This is only the API part of Human-Connection, you have to also checkout the [WebApp](https://github.com/Human-Connection/WebApp) which uses this API.

## Installation via docker

Make sure you have a recent version of [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).

Run:
```bash
$ docker-compose up --build
```
Now, your API should be running at [http://localhost:3030](http://localhost:3030)
and you can see some contributions at [http://localhost:3030/contributions](http://localhost:3030/contributions).

For debugging you can run:
```bash
$ docker-compose run --rm --service-ports api yarn run dev:debug
```
And debug your app with [Chrome Dev Tools](chrome://inspect).

### Configuration in Docker

Change configuration in `config/docker/local-development.json` or
`config/docker/local.json` and rerun `docker-compose up --build`.

#### Local Staging Environment

To get an environment which is close to production, run the following:
```sh
$ docker-compose -f docker-compose.yml -f docker-compose.staging.yml up --build
```

### Testing in Docker

Run the entire test suite with:
```bash
$ docker-compose run --rm api yarn run test
```

If you want you can run specific tests:
```bash
$ docker-compose run --rm api yarn run mocha
$ docker-compose run --rm api yarn run cucumber
```


## Local installation

> we recommand to install the project locally for the best development ease and performance

Getting up and running is as easy as 1, 2, 3, 4 ... 5.

1. Make sure you have a recent version of [NodeJS](https://nodejs.org/), [yarn](https://yarnpkg.com) and [mongoDB](https://www.mongodb.com/download-center#community) installed.

2. Clone this repo
   ``` bash
   $ git clone https://github.com/Human-Connection/API.git
   ```

3. Install your dependencies
   ``` bash
   $ cd ./API
   $ yarn
   ```
4. Setup database seeder for local development (recommended)

   Run
   ```sh
   $ cp config/local.example.json config/local.json
   ```

5. Setup local mailserver (optional)

   >  **Note:**
   >  *You only have to start that mailserver when you want to register, reset your password or test emails in any form, it
   >  does not affect the rest of the application.*

   Install the [MailDev](https://github.com/djfarrelly/MailDev)
   server to catch all sent emails in a nice web interface.

   ``` bash
   # install mail dev (only has to be done once)
   $ yarn global add maildev

   # start the server, it will output the web url
   # which normally is http://localhost:1080
   $ maildev
   ```

   You could also insert your smtp credentials into the local.json but that is not recommended as all emails would be sent
   to the given addresses which should not happen in development.

6. Start server

   You don't have a background process running for  mongodb?
   Just open another terminal and run:
 
   ```bash
	 # open up another terminal and run:
   $ yarn run mongo
   # or if you are on windows, run:
   $ yarn run mongo:win
   ```
   > ##### IMPORTANT for Windows users:
   > - make sure you have mongo bin directory added to your PATH

   Start the API server with the following commands:
   ``` bash
   $ yarn dev

   # without hot reload
   $ yarn start
   # you can customize the environment like this:
   $ NODE_ENV=production yarn start
   ```


   Now, your API should be running at [http://localhost:3030](http://localhost:3030).
   If you seeded your database, you will see some contributions at [http://localhost:3030/contributions](http://localhost:3030/contributions).


### Local Configuration

You can override any default configuration in `config/local.json`. You can find
a list of availabe defaults in `config/default.json`.
See [node-config documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files)
for details.

E.g. if you want to access the server from your mobile over WiFi, you should
replace `localhost` in your settings with your IP address in the local network:
```json
{
  "host": "192.168.188.22",
  "baseURL": "http://192.168.188.22:3030",
  "frontURL": "http://192.168.188.22:3000"
}

```

### Local Testing

Run the entire test suite with:
```bash
$ yarn run test
```

If you want you can run specific tests:
```bash
$ yarn run mocha
$ yarn run cucumber
```


## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

``` bash
$ yarn global add feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the framework related things visit [docs.feathersjs.com](http://docs.feathersjs.com).

The HC platform is documented in our [gitbook](https://www.gitbook.com/book/human-connection/documentation/) (work in progress).

## License

Copyright (c) 2018 [Human-Connection.org](https://human-connection.org)

Licensed under the [MIT](https://github.com/Human-Connection/WebApp/blob/develop/LICENSE.md) license.
