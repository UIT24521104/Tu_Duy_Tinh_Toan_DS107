# ---- Stage 1: build React/Vite ----
FROM node:20-alpine AS build

WORKDIR /app

# Cài dependencies (cài mới, không dùng node_modules đã commit)
COPY frontend/package*.json ./
RUN npm install

# Copy source và build ra dist/
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: serve bằng Nginx ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
