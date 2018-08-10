const express = require('express');
const nexus = require('../services/nexus');

const router = express.Router();
let config;

router.get('/', (req, res) => {
  res.render('artifact', {
    title: 'Home',
    current: '',
    artifacts: config.artifacts(),
    elmts: [],
  });
});

router.addRoute = function addRoute(artifact) {
  router.get(`/${artifact.artifactId}-${artifact.extension}`, (req, res, next) => {
    nexus.query(artifact.groupId, artifact.artifactId, artifact.extension)
      .then(elmts => res.render('artifact', {
        title: artifact.name,
        current: `${artifact.artifactId}-${artifact.extension}`,
        artifacts: config.artifacts(),
        elmts,
      }))
      .catch(next);
  });
};

module.exports = function initialize(cfg) {
  config = cfg;
  return router;
};
