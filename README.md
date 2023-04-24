<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Environment Configuration
 `.env file`
```bash
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=employees
APP_PORT=3000
EMAIL=quang.nv@gmail.com
PASSWORD=Secret@123
NAME=Quang
```
```bash
DB_PORT,DB_USERNAME,DB_PASSWORD,DB_NAME: database configuration
APP_PORT:  Application port
EMAIL,PASSWORD,NAME: The account you want to use to access

You can change environment values to any if you want or it will get default values like example file
```

## Installation

- [NodeJS environment](https://nodejs.org/en)_
- Install Node environment first  (Suggest NodeJS version 18.x.x)

```bash
$ npm install
```

## Start Postgres Database container 
- It's used for starting app by source
- If you want to use `docker-compose.yaml` file, you don't need to run this command

```bash
docker-compose up db -d 
```

## Running the app

```bash
# watch development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running by Docker container
`1.docker-compose.yaml`
`Start app`
```bash
docker-compose up -d
```
`Shutdown app`
```bash
docker-compose down
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Application Use Guide

# 1. Swagger API
 - here: [Documents](http://localhost:3001/documents/).
# 2.APIs

`Login API`
```bash
curl --location 'http://localhost:3000/auth/sign-in' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "quang.nv@gmail.com",
  "password": "Secret@123"
}'
```

`Get all employee relationships API`
```bash
curl --location 'http://localhost:3000/employees' \
--header 'Authorization: Bearer ${ACCESS_TOKEN}'
```

`Get all relationship of a employee by name API`
```bash
curl --location 'http://localhost:3000/employees?name=Sophie' \
--header 'Authorization: Bearer  ${ACCESS_TOKEN}'
```

## License
Develop by [Quang](https://github.com/nnguyenquangg).
