# hc-api

> Human Connection API

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3 ... 4.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [rethinkdb](https://www.rethinkdb.com/docs/install/)  installed.
2. Clone this repo
    ```
    git clone https://git@team.human-connection.org/bitbucket/scm/hc/hc-api-feathers.git
    ```
3. Install your dependencies

    ```
    cd ./hc-api-feathers; npm install
    ```

4. Start developing

    ```
    npm run dev
    ```

### Dev Urls

RethinkDB Administration: [http://localhost:8080/](http://localhost:8080/)

Feathers API: [http://localhost:3030/](http://localhost:3030/)

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
