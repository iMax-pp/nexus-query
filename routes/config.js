const express = require('express');

const router = express.Router();
let config;

router.get('/', (req, res) => {
  res.render('config', {
    title: 'Configuration',
    artifacts: config.artifacts(),
  });
});

router.post('/', (req, res) => {
  config.addArtifact(req.body.name, req.body.groupId, req.body.artifactId, req.body.extension);
  res.redirect('/config');
});

router.post('/delete/:id', (req, res) => {
  config.deleteArtifact(req.param('id'));
  res.redirect('/config');
});

module.exports = function initialize(cfg) {
  config = cfg;
  return router;
};
