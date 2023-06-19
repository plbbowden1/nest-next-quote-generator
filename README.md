# Peter Bowden - Random Quote Generator

## Overview

This is a simple fullstack app powered by NestJS on the backend and NextJS on the frontend. The backend has full CRUD functionality, though I did not implement any of the create/update/delete on the frontend for this project.

## Additional Feature

In addition to the NextJS client, I chose to add cookie-based authentication to this project. This feature allows users to create an account (or login if they've already done so) and flip through the entire quote database with skip and take pagination. Each authenticated session lasts 15min.

## Installation & Launch

```bash
$ npm install
$ npm run build
$ npm run start
```

## Test

I found the end-to-end testing a bit challenging to set up under the time constraints due to the added complexity of the NestJS/NextJS hybrid approach, so I opted to focus on a more robust suite of unit tests on the auth and quote modules.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

# Thank you for your time and consideration!
