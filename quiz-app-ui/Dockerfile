# Stage 1 - Build Angular
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2 - Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/quiz-app-ui/browser /usr/share/nginx/html

# rename Angular CSR entry file
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80