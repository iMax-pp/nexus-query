import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import nexus from '../services/nexus';
import { Config } from '../services/app-config';
import { Artifact } from '../types/artifact';

export default class ArtifactsRouter {
  private config: Config;
  private _router = express.Router();
  get router(): express.Router {
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

  addRoute(art: Artifact): void {
    this._router.get(`/${art.groupId}.${art.artifactId}.${art.extension}`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const elmts = await nexus.query(art.groupId, art.artifactId, art.extension)
        res.render('artifact', {
          title: art.name,
          current: `${art.groupId}.${art.artifactId}.${art.extension}`,
          artifacts: this.config.artifacts,
          elmts,
        });
      } catch (err) {
        next(err);
      }
    });
  }
}
