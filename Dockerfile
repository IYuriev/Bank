FROM node:20-alpine
WORKDIR /home/node/app
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY package*.json ./
USER root
RUN npm install
USER node
COPY --chown=node:node . .
COPY --chown=node:node prisma prisma
RUN npx prisma generate --schema=./prisma/schema/schema.prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
