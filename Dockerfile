FROM ubuntu:xenial

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1655A0AB68576280

RUN set -ex \
    && apt-get update \
    && DEBIAN_FRONTEND="noninteractive" \
      apt-get install -y --no-install-recommends ruby2.3 ruby2.3-dev git-all curl build-essential libssl-dev

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN set -ex \
    && apt-get update \
      && apt-get install -y nodejs

RUN gem install sass compass s3_website

WORKDIR /usr/src/app

RUN npm install -g grunt-cli bower

COPY . .

RUN npm install
RUN bower --allow-root install

EXPOSE 9000

CMD ["grunt", "serve"]
