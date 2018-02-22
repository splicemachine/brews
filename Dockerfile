FROM openjdk:8-jdk

MAINTAINER Nikhil Nygaard <nikhil.nygaard@gmail.com>

ENV NODE_VERSION 8
RUN apt-get update
RUN apt-get install -y build-essential

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
ADD ./static /app/static
ADD ./server /app/server
ADD ./config /app/config

ADD ./package.json /app
ADD ./package-lock.json /app
ADD ./webpack.config.js /app
ADD ./.babelrc /app
ADD gulpfile.babel.js /app
ADD tsconfig.json /app

# Disable package.lock
# https://codeburst.io/disabling-package-lock-json-6be662f5b97d
RUN npm config set package-lock false
RUN npm install --no-optional
RUN npm install -g pm2
RUN npm install -g gulp-cli

# https://github.com/gulpjs/gulp-cli/issues/142
# Ignore red messages from gulp because they log.error a requirement chain...
RUN npm run build

CMD ["npm", "start"]
