FROM ubuntu:trusty

RUN set -ex \
    && apt-get update \
    && DEBIAN_FRONTEND="noninteractive" \
      apt-get install -y --no-install-recommends ruby1.9.1-dev nodejs npm git-all

RUN gem install sass -v 3.4.17
RUN gem install --force --no-rdoc --no-ri compass -v 0.11.0

WORKDIR /usr/src/app

RUN npm install -g grunt-cli bower

COPY . .

RUN npm install
RUN bower --allow-root install

EXPOSE 9000

CMD ["grunt", "serve"]
