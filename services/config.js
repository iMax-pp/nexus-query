const artifacts = new Map();

module.exports = {
  router: {},
  setRouter: function setRouter(router) {
    this.router = router;
  },

  artifacts: function getArtifacts() {
    return Array.from(artifacts.values());
  },

  addArtifact: function addArtifact(name, groupId, artifactId, extension) {
    const artifact = {
      name,
      groupId,
      artifactId,
      extension,
    };
    artifacts.set(`${groupId}:${artifactId}:${extension}`, artifact);
    this.router.addRoute(artifact);
  },
  deleteArtifact: function deleteArtifact(id) {
    artifacts.delete(id);
  },
};
