# Step 1: Build React app with Vite
FROM node:18 AS build
WORKDIR /app

# Copy dependency files first
COPY package*.json ./
RUN npm install

# Copy source code + env file explicitly
COPY . .
COPY .env.production .env.production

# Build the app (Vite reads .env.production automatically)
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
