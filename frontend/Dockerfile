FROM node:22-alpine as build

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn format

RUN yarn cache clean

RUN yarn build

#---

FROM nginx:1.25-alpine AS production

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80