import * as express from 'express';
import { Request, Response } from 'express';
import { Config } from '../services/app-config';

export default class ConfigRouter {
  private config: Config;
  private _router = express.Router();
  get router() {
    return this._router;
  }

  constructor(cfg: Config) {
    this.config = cfg;
    this.initRoutes();
  }

  private initRoutes() {
    this._router.get('/', (req: Request, res: Response) => {
      res.render('config', {
        title: 'Configuration',
        artifacts: this.config.artifacts,
      });
    });

    this._router.post('/', (req: Request, res: Response) => {
      this.config.addArtifact(req.body.name, req.body.groupId, req.body.artifactId, req.body.extension);
      res.redirect('/config');
    });

    this._router.delete('/:id', (req: Request, res: Response) => {
      this.config.deleteArtifact(req.params.id);
      res.redirect('/config');
    });
  }
}
