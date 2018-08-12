import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import nexus from '../services/nexus';
import { Config } from '../services/app-config';

export default class ArtifactsRouter {
  private config: Config;
  private _router = express.Router();
  get router() {
    return this._router;
  }

  constructor(cfg: Config) {
    this.config = cfg;
    // init main route
    this._router.get('/', (req: Request, res: Response) => {
      res.render('artifact', {
        title: 'Home',
        current: '',
        artifacts: this.config.artifacts,
        elmts: [],
      });
    });
  }

  addRoute(artifact) {
    this._router.get(`/${artifact.artifactId}-${artifact.extension}`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        let elmts = await nexus.query(artifact.groupId, artifact.artifactId, artifact.extension)
        res.render('artifact', {
          title: artifact.name,
          current: `${artifact.artifactId}-${artifact.extension}`,
          artifacts: this.config.artifacts,
          elmts,
        });
      } catch (err) {
        next(err);
      }
    });
  };
}
