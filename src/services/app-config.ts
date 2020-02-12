import { Artifact } from '../types/artifact';
import * as fs from 'fs';

const DB_FILE = 'data/artifacts.db';

export class Config {
  private static artifacts = new Map<string, Artifact>();
  get artifacts(): Array<Artifact> {
    return Array.from(Config.artifacts.values());
  }

  private _router;
  set router(r) {
    this._router = r;
  }

  initFromDb(): void {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
      if (err) {
        console.log(err.message);
        Config.artifacts = new Map<string, Artifact>();
      } else {
        Config.artifacts = new Map<string, Artifact>(JSON.parse(data));
        Config.artifacts.forEach(art => this._router.addRoute(art));
      }
    });
  }

  addArtifact(name: string, groupId: string, artifactId: string, extension: string): void {
    const id = `${groupId}.${artifactId}.${extension}`;
    const artifact = {
      name,
      groupId,
      artifactId,
      extension,
    };
    Config.artifacts.set(id, artifact);
    fs.writeFile(DB_FILE, JSON.stringify([...Config.artifacts]), err => {
      if (err) throw err;
    });
    this._router.addRoute(artifact);
  }

  deleteArtifact(id: string): void {
    Config.artifacts.delete(id);
    fs.writeFile(DB_FILE, JSON.stringify([...Config.artifacts]), err => {
      if (err) throw err;
    });
  }
}

export default new Config();