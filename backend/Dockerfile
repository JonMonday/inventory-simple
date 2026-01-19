FROM node:20-alpine

# Install dependencies for Prisma and native binaries
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci --loglevel warn --network-timeout=1000000

# Copy prisma schema first to generate client
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN npm run build
RUN ls -la dist/src/main.js

CMD ["npm", "run", "start:prod"]
