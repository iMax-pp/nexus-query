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

  async query(group: string, artifact: string, extension: string): Promise<Element[]> {
    const body = await request(`${nexusUrl}/service/local/lucene/search?g=${group}&a=${artifact}&p=${extension}`);
    const xml = await xml2js(body);
    return this.parseNexusResponse(xml, extension);
  }

  private parseNexusResponse(response, extension: string): Promise<Element[]> {
    if (response.searchNGResponse.data[0] === '') {
      return Promise.resolve([]);
    }

    return Promise.all<Element>(response.searchNGResponse.data[0].artifact.map(async (elmt) => {
      const repositoryId = elmt.artifactHits[0].artifactHit[0].repositoryId[0];
      const groupId = elmt.groupId[0];
      const artifactId = elmt.artifactId[0];
      const version = elmt.version[0];
      const url = `${nexusUrl}/service/local/artifact/maven/content?r=${repositoryId}&g=${groupId}&a=${artifactId}&p=${extension}&v=${version}`
      const headers = await request.head(url)
      return {
        repositoryId,
        groupId,
        artifactId,
        version,
        timestamp: new Date(headers['last-modified']).getTime(),
        extension,
        url,
      };
    }));
  }
}

export default new Nexus();
