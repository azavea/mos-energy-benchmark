FROM ubuntu:trusty

RUN set -ex \
    && apt-get update \
    && apt-get install -y --no-install-recommends ruby1.9.1-dev nodejs npm

RUN gem install sass -v 3.4.17
RUN gem install compass -v 0.10.6

RUN npm install -g grunt-cli bower
RUN npm install
RUN bower install
