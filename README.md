BuildingEnergyBenchmarking
==========================

http://visualization.phillybuildingbenchmarking.com/#/

### Build Status
[![](https://travis-ci.org/azavea/mos-energy-benchmark.svg?branch=develop)](https://travis-ci.org/azavea/mos-energy-benchmark)

### Developing

#### Dependencies
Docker and Docker Compose. The current development setup is known to work with the following versions:
Docker: 19 and 20
Docker Compose: 1.23 and 1.27

Other versions are likely to work as well.

#### Setup
This project is containerized via Docker.

Run `./scripts/setup` from directory root

#### Run
Then run `./scripts/server`

The dev app will be served at http://localhost:9000 and automatically opened in a new tab in your default browser.

The app will auto refresh after saving js/css/html

### Deploying

1. `docker-compose run app grunt build --env=prod`
4. `docker-compose run -e MOS_S3_ID=<AWS_ACCESS_KEY_ID> -e MOS_S3_SECRET=<AWS_SECRET_ACCESS_KEY> app s3_website push`


### Testing

`npm test` will run the test suite.

Note that tests require Chrome 59+, for the headless browser support.
