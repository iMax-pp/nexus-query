import { Artifact } from '../types/artifact';

export class Config {
  private static artifacts = new Map<string, Artifact>();
  get artifacts(): Array<Artifact> {
    return Array.from(Config.artifacts.values());
  }

  private _router;
  set router(r) {
    this._router = r;
  }

  addArtifact(name: string, groupId: string, artifactId: string, extension: string) {
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

  deleteArtifact(id: string) {
    Config.artifacts.delete(id);
  }
}

export default new Config();