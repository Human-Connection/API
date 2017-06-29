# hc-api

> Human Connection API

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3, 4 ... 5.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [mongoDB](https://www.mongodb.com/download-center#community)  installed.

2. Clone this repo
    ``` bash
    $ git clone https://git@team.human-connection.org/bitbucket/scm/hc/hc-api-feathers.git
    ```
    
3. Install your dependencies

    ``` bash
    $ cd ./hc-api-feathers; npm install
    ```
    
4. If you want to use email verification, copy `config/local.example.json` to `config/local.json` and put in your smtp connection details

5. Start server

    ``` bash
    # start mongodb, feathers and seed database
    $ npm run dev
   
    # start mongodb, feathers without seeding the database
    $ npm run dev-noseed
    
    # start mongodb, feathers for production
    $ npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

``` bash
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
