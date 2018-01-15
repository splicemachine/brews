#FROM alpine:3.2
FROM frolvlad/alpine-oraclejdk8

MAINTAINER Nikhil Nygaard
RUN apk update && apk upgrade

# Dev Deps
RUN apk add bash
RUN apk add bash-doc
RUN apk add bash-completion
#RUN apk add curl
RUN apk add nodejs
RUN rm -rf /var/cache/apk/*

# Python
# https://github.com/gliderlabs/docker-alpine/blob/master/docs/usage.md
RUN apk add --update python
RUN apk add --update python-dev
RUN apk add --update py-pip
RUN apk add --update build-base
RUN pip install virtualenv

## Java (fuck you oracle)
## Install cURL
#RUN apk --update add curl ca-certificates tar
#RUN curl -Ls https://circle-artifacts.com/gh/andyshinn/alpine-pkg-glibc/6/artifacts/0/home/ubuntu/alpine-pkg-glibc/packages/x86_64/glibc-2.21-r2.apk > /tmp/glibc-2.21-r2.apk
#RUN apk add --allow-untrusted /tmp/glibc-2.21-r2.apk
#
## Java Version
#ENV JAVA_VERSION_MAJOR 8
#ENV JAVA_VERSION_MINOR 45
#ENV JAVA_VERSION_BUILD 14
#ENV JAVA_PACKAGE       jdk
#
## Download and unarchive Java
#RUN mkdir /opt && curl -jksSLH "Cookie: oraclelicense=accept-securebackup-cookie"\
#  http://download.oracle.com/otn-pub/java/jdk/${JAVA_VERSION_MAJOR}u${JAVA_VERSION_MINOR}-b${JAVA_VERSION_BUILD}/${JAVA_PACKAGE}-${JAVA_VERSION_MAJOR}u${JAVA_VERSION_MINOR}-linux-x64.tar.gz \
#    | tar -xzf - -C /opt &&\
#    ln -s /opt/jdk1.${JAVA_VERSION_MAJOR}.0_${JAVA_VERSION_MINOR} /opt/jdk &&\
#    rm -rf /opt/jdk/*src.zip \
#           /opt/jdk/lib/missioncontrol \
#           /opt/jdk/lib/visualvm \
#           /opt/jdk/lib/*javafx* \
#           /opt/jdk/jre/lib/plugin.jar \
#           /opt/jdk/jre/lib/ext/jfxrt.jar \
#           /opt/jdk/jre/bin/javaws \
#           /opt/jdk/jre/lib/javaws.jar \
#           /opt/jdk/jre/lib/desktop \
#           /opt/jdk/jre/plugin \
#           /opt/jdk/jre/lib/deploy* \
#           /opt/jdk/jre/lib/*javafx* \
#           /opt/jdk/jre/lib/*jfx* \
#           /opt/jdk/jre/lib/amd64/libdecora_sse.so \
#           /opt/jdk/jre/lib/amd64/libprism_*.so \
#           /opt/jdk/jre/lib/amd64/libfxplugins.so \
#           /opt/jdk/jre/lib/amd64/libglass.so \
#           /opt/jdk/jre/lib/amd64/libgstreamer-lite.so \
#           /opt/jdk/jre/lib/amd64/libjavafx*.so \
#           /opt/jdk/jre/lib/amd64/libjfx*.so
#
## Set environment
#ENV JAVA_HOME /opt/jdk
#ENV PATH ${PATH}:${JAVA_HOME}/bin

WORKDIR /app
ADD ./client /app/client
ADD ./server /app/server
ADD ./package.json /app
ADD ./webpack.config.js /app
ADD ./.babelrc /app

# Disable package.lock
# https://codeburst.io/disabling-package-lock-json-6be662f5b97d
RUN npm config set package-lock false
RUN npm install --no-optional --silent
RUN npm install -g pm2 --silent

RUN npm run build

## Add the patch fix
#COPY common/stack-fix.c /lib/
#
## Prepare the libraries packages
#RUN set -ex \
#    && apk add --no-cache  --virtual .build-deps build-base \
#    && gcc  -shared -fPIC /lib/stack-fix.c -o /lib/stack-fix.so \
#    && apk del .build-deps
#
## export the environment variable of LD_PRELOAD
#ENV LD_PRELOAD /lib/stack-fix.so

CMD ["npm", "start"]

# Attach terminal to this running container
# docker exec -i -t [container] /bin/bash
