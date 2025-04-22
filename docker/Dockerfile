FROM node:20-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install -g wait-port
COPY ./tsconfig.json ./
COPY ./prisma ./prisma
RUN npx prisma generate
COPY ./src ./src
COPY ./data ./data
COPY ./__tests__ ./__tests__
COPY ./jest.config.js ./jest.config.js
COPY ./tsconfig.test.json ./tsconfig.test.json
RUN npm run build
CMD ["npm", "start"]