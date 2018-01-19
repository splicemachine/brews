FROM openjdk:8-jdk

MAINTAINER Filiosoft, LLC <Team@Filiosoft.com>

ENV NODE_VERSION 8
RUN apt-get update
RUN apt-get install -y build-essential
#RUN apt-get install -y build-essential

RUN apt-get update && \
    apt-get install --no-install-recommends -y apt-transport-https  && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install --no-install-recommends -y nodejs yarn  && \
    node -v && npm -v && yarn -V && \
    npm i -g npx && \
    apt-get -y autoremove && \
    apt-get -y autoclean && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /app
ADD ./client /app/client
ADD ./server /app/server
ADD ./package.json /app
ADD ./webpack.config.js /app
ADD ./.babelrc /app
ADD gulpfile-old.js /app

# Disable package.lock
# https://codeburst.io/disabling-package-lock-json-6be662f5b97d
RUN npm config set package-lock false
RUN npm install --no-optional
RUN npm install -g pm2
RUN npm install -g gulp
#RUN npm install --no-optional --silent
#RUN npm install -g pm2 --silent

RUN gulp compile

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



