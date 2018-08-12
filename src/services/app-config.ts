import { Artifact } from '../types/artifact';

export class Config {
  private static artifacts = new Map<String, Artifact>();
  get artifacts(): Array<Artifact> {
    return Array.from(Config.artifacts.values());
  }

  private _router;
  set router(r) {
    this._router = r;
  }

  addArtifact(name: String, groupId: String, artifactId: String, extension: String) {
    let id = `${groupId}:${artifactId}:${extension}`;
    let artifact = {
      name,
      groupId,
      artifactId,
      extension,
    };
    Config.artifacts.set(id, artifact);
    this._router.addRoute(artifact);
  }

  deleteArtifact(id: String) {
    Config.artifacts.delete(id);
  }
}

export default new Config();