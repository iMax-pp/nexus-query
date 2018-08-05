const express = require('express');
const artifacts = require('config').get('Artifacts');
const nexus = require('../services/nexus');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('artifact', {
    title: 'Home',
    current: '',
    artifacts,
    elmts: [],
  });
});

artifacts.forEach((art) => {
  router.get(`/${art.artifactId}`, (req, res) => {
    res.render('artifact', {
      title: art.name,
      current: art.artifactId,
      artifacts,
      elmts: nexus.query(art.groupId, art.artifactId, art.extension),
    });
  });
});

module.exports = router;
