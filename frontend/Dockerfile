# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL
ARG VITE_SSE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SSE_URL=$VITE_SSE_URL

RUN npm run build

# Nginx Stage for serving static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
