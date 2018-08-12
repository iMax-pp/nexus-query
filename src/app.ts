import * as createHttpError from 'http-errors';
import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';

import cfg from './services/app-config';
import ArtifactsRouter from './routes/artifacts';
import ConfigRouter from './routes/config';

class App {
  private artifactsRouter = new ArtifactsRouter(cfg);
  private configRouter = new ConfigRouter(cfg);

  private _express: Application;
  get express() {
    return this._express;
  }

  constructor() {
    this._express = express();
    cfg.router = this.artifactsRouter;
    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    // view engine setup
    this._express.set('views', join(__dirname, 'views'));
    this._express.set('view engine', 'jade');
    this._express.locals.moment = require('moment');

    // middlewares setup
    this._express.use(logger('dev'));
    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: false }));
    this._express.use(cookieParser());
    this._express.use(express.static(join(__dirname, '..', 'public')));
    this._express.use('/favicon.ico', express.static(join(__dirname, '..', 'public', 'images', 'favicon.ico')));
  }

  private initRoutes() {
    // routes setup
    this._express.use('/artifact', this.artifactsRouter.router);
    this._express.use('/config', this.configRouter.router);
    this._express.get('/', (req, res) => res.redirect('/artifact'));

    // catch 404 and forward to error handler
    this._express.use((req: Request, res: Response, next: NextFunction) => {
      next(createHttpError(404));
    });

    // error handler
    this._express.use((err, req: Request, res: Response, next: NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error', { title: 'Error', artifacts: cfg.artifacts });
    });
  }
}

export default new App().express;
