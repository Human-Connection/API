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

  You don't have a background process running for mongodb?
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

7. Setup and Start Thumbnail Service (optional)

   We are using [Thumbor](https://github.com/thumbor/thumbor) as a Thumbnail Microservice.
   You can install it locally if you like but this is totally optional.

   **Install OR use docker**

   - At first you have to [install](http://thumbor.readthedocs.io/en/latest/installing.html) it locally and start it in the console with `thumbor` **OR** run it with docker `docker run -p 8000:8000 apsl/thumbor`
   - Set the `thumbor.url` in `config/local.json` to `http://localhost:8888` (with docker `http://localhost:8000`) if not defined differently. The `thumbor.key` does not necessarily have to be defined, it just makes the URL more secure.

   > Do not forget to always start it if you choose that setup or otherwise you will not see any pictures at all.

### Local configuration

You can override any default configuration in `config/local.json`. You can find
a list of availabe defaults in `config/default.json`.
See [node-config documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files)
for details.

## Testing

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
