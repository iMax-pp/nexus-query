FROM node:10

USER node

COPY . /home/node/nexus-query
WORKDIR /home/node/nexus-query
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]