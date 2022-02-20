FROM node:16.8.0 AS BUILD_IMAGE

WORKDIR '/dist'

COPY ./package.json .
COPY ./browser.js .
COPY ./postinstall.js .
COPY ./yarn.lock .
RUN yarn install
RUN yarn global add expo-cli

ARG CACHEBUST=1

COPY ./src ./src
COPY ./index.js .
COPY ./web ./web
COPY ./App.tsx .
COPY ./app.json .
COPY ./babel.config.js .
COPY ./webpack.config.js .
COPY ./tsconfig.json .
COPY ./.eslintrc.json .

RUN npm run build:web:production

EXPOSE 80

FROM nginx
COPY --from=BUILD_IMAGE /dist/web-build /usr/share/nginx/html
