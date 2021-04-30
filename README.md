BuildingEnergyBenchmarking
==========================

http://visualization.phillybuildingbenchmarking.com/#/

### Build Status
[![](https://travis-ci.org/azavea/mos-energy-benchmark.svg?branch=develop)](https://travis-ci.org/azavea/mos-energy-benchmark)

### Developing

#### Dependencies
Docker

#### Setup
This project is containerized via Docker.

Run `docker build .` from directory root

#### Run
Then run `docker run --rm -p 9000:9000 <image_id> grunt serve`

The dev app will be served at http://localhost:9000 and automatically opened in a new tab in your default browser.

The app will auto refresh after saving js/css/html

### Deploying

1. `grunt build --env=prod`
2. `gem install s3_website` if you haven't already
3. `export MOS_S3_ID=ENTER_S3_ID_HERE MOS_S3_SECRET=ENTER_S3_SECRET_HERE`
4. `s3_website push`


### Testing

`npm test` will run the test suite.

Note that tests require Chrome 59+, for the headless browser support.
