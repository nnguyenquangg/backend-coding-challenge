FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV production APP_PORT=${APP_PORT}
EXPOSE ${APP_PORT}
CMD ["npm", "run", "start:prod"]
