FROM ubuntu:trusty

RUN set -ex \
    && apt-get update \
    && DEBIAN_FRONTEND="noninteractive" \
      apt-get install -y --no-install-recommends ruby1.9.1-dev git-all curl build-essential libssl-dev

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1655A0AB68576280

RUN set -ex \
    && apt-get update \
      && apt-get install -y nodejs

RUN gem install sass -v 3.1.0.alpha.249
RUN gem install --force --no-rdoc --no-ri compass -v 0.11.0

WORKDIR /usr/src/app

RUN npm install -g grunt-cli bower

COPY . .

RUN npm install
RUN bower --allow-root install

EXPOSE 9000

CMD ["grunt", "serve"]
