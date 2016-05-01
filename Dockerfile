FROM ubuntu
MAINTAINER Muhd Amrullah <muhd.amrullah@facerecog.asia>

RUN apt-get update && apt-get install -y \
    curl \
    git \
    python-dev \
    python-pip \
    nodejs \
    npm \
    wget \
    && npm cache clean -f \
    && npm install -g n \
    && n stable \
    && ln -sf /usr/local/n/versions/node/6.0.0/bin/node /usr/bin/node \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD . /home/deep-psyche
EXPOSE 5000
