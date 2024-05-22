#   BUILD STAGE 1

FROM node:20.12.0 as node
WORKDIR /app

COPY . .

RUN npm install

RUN npm run build -- --configuration production

# STAGE 2
FROM nginx:alpine
COPY --from=node /app/dist/open_jobs /usr/share/nginx/html

# Copy nginx.confi
COPY /root/kuber-services/Nginx-config /etc/nginx/nginx.conf
