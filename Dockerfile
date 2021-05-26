FROM ubuntu:xenial
ARG s3_website_version=2.7.6

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1655A0AB68576280

RUN set -ex \
    && apt-get update \
    && DEBIAN_FRONTEND="noninteractive" \
      apt-get install -y --no-install-recommends ruby2.3 ruby2.3-dev git-all curl build-essential libssl-dev

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

# s3_website is actually written in Scala even though it's on Ruby Gems
RUN set -ex \
    && apt-get update \
      && apt-get install -y nodejs openjdk-8-jre

RUN gem install sass compass s3_website:$s3_website_version
WORKDIR /var/lib/gems/2.3.0/gems/s3_website-$s3_website_version/
# s3_website downloads and installs its .jar file on first execution
RUN curl -o s3_website-$s3_website_version.jar -L https://github.com/laurilehmijoki/s3_website/releases/download/v$s3_website_version/s3_website.jar 

WORKDIR /usr/src/app

RUN npm install -g grunt-cli bower

COPY . .

EXPOSE 9000
