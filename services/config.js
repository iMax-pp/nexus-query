const artifacts = [];

module.exports = {
  router: {},
  setRouter: function setRouter(router) {
    this.router = router;
  },

  artifacts: function getArtifacts() {
    return artifacts;
  },

  addArtifact: function addArtifact(name, groupId, artifactId, extension) {
    const artifact = {
      name,
      groupId,
      artifactId,
      extension,
    };
    artifacts.push(artifact);
    this.router.addRoute(artifact);
  },
};
