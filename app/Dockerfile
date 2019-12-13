FROM node:12.8

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app/package.json
RUN yarn install
RUN yarn add pushstate-server

COPY . /opt/app
ENV REACT_APP_API_URL=http://localhost:5000
RUN yarn build

EXPOSE 9000
CMD node_modules/.bin/pushstate-server -d build
