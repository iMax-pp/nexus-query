const request = require('request-promise-native');
const xml2js = require('xml2js-es6-promise');
const nexusUrl = require('config').get('nexus.url');

function parseNexusResponse(response, extension) {
  if (response.searchNGResponse.data[0] === '') {
    return [];
  }
  return Promise.all(response.searchNGResponse.data[0].artifact.map((elmt) => {
    const repositoryId = elmt.artifactHits[0].artifactHit[0].repositoryId[0];
    const groupId = elmt.groupId[0];
    const artifactId = elmt.artifactId[0];
    const version = elmt.version[0];
    return request(`${nexusUrl}/service/local/artifact/maven/resolve?r=${repositoryId}&g=${groupId}&a=${artifactId}&p=${extension}&v=${version}`)
      .then(body => xml2js(body))
      .then(xml => ({
        repositoryId,
        groupId,
        artifactId,
        version,
        timestamp: xml['artifact-resolution'].data[0].snapshotTimeStamp[0],
        extension,
        url: `${nexusUrl}/service/local/artifact/maven/content?r=${repositoryId}&g=${groupId}&a=${artifactId}&p=${extension}&v=${version}`,
      }));
  }));
}

module.exports = {
  query: function query(group, artifact, extension) {
    return request(`${nexusUrl}/service/local/lucene/search?g=${group}&a=${artifact}&p=${extension}`)
      .then(body => xml2js(body))
      .then(xml => parseNexusResponse(xml, extension));
  },
};
