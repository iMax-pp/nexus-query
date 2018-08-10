FROM node:10

USER node
ENV NODE_ENV production

COPY . /home/node/nexus-query
WORKDIR /home/node/nexus-query
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]