import * as request from 'request-promise-native';
import { parseString } from 'xml2js';
import * as env from 'config';
import { Element } from '../types/element';

const nexusUrl = env.get('nexus.url');
function xml2js(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  })
}

class Nexus {

  async query(group: string, artifact: string, extension: string) {
    let body = await request(`${nexusUrl}/service/local/lucene/search?g=${group}&a=${artifact}&p=${extension}`);
    let xml = await xml2js(body);
    return this.parseNexusResponse(xml, extension);
  }

  private parseNexusResponse(response, extension: string): Promise<Element[]> {
    if (response.searchNGResponse.data[0] === '') {
      return Promise.resolve([]);
    }

    return Promise.all<Element>(response.searchNGResponse.data[0].artifact.map(async (elmt) => {
      let repositoryId = elmt.artifactHits[0].artifactHit[0].repositoryId[0];
      let groupId = elmt.groupId[0];
      let artifactId = elmt.artifactId[0];
      let version = elmt.version[0];
      let body = await request(`${nexusUrl}/service/local/artifact/maven/resolve?r=${repositoryId}&g=${groupId}&a=${artifactId}&p=${extension}&v=${version}`)
      let xml = await xml2js(body);
      return {
        repositoryId,
        groupId,
        artifactId,
        version,
        timestamp: Number(xml['artifact-resolution'].data[0].snapshotTimeStamp[0]),
        extension,
        url: `${nexusUrl}/service/local/artifact/maven/content?r=${repositoryId}&g=${groupId}&a=${artifactId}&p=${extension}&v=${version}`,
      };
    }));
  }
}

export default new Nexus();
