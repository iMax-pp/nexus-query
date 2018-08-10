# nexus-query
`nexus-query` is a Node.js web application listing the different versions of an artifact from a given Nexus.
It also provides a link to download each version.

## Production
To run the application, using Docker:
- build the image: `docker build -t nexus-query .`
- launch it: `docker run -d -p 3000:3000 -e NEXUS_URL="http://url_to_a_nexus/" nexus-query`

The web application listens on port `3000`.

The `NEXUS_URL` environment variable is required to define which Nexus repository to address.

## Development
To launch the application in development mode:
- install Node dependencies: `npm install`
- if necessary, change the Nexus URL in file `config/development.json`
- run it: `NODE_ENV=development npm start`

For hot-reload of modifications, `nodemon` can be used:
- install it: `npm install -g nodemon`
- run the web application using it: `NODE_ENV=development nodemon --inspect ./bin/www`
