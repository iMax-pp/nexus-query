FROM node:10

COPY . /home/node/nexus-query
WORKDIR /home/node/nexus-query
RUN npm install && \
    npm run build

ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]