const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressPromise = require('express-promise');

const cfg = require('./services/config');
const artifactsRouter = require('./routes/artifacts')(cfg);
const configRouter = require('./routes/config')(cfg);

cfg.setRouter(artifactsRouter);
cfg.addArtifact('Test', 'fr.imaxpp', 'test-nexus', 'war');
cfg.addArtifact('Inexistant', 'fr.imaxpp', 'test-inexistant', 'ear');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.locals.moment = require('moment');

app.use(expressPromise());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use('/artifact', artifactsRouter);
app.use('/config', configRouter);
app.use('/', (req, res) => res.redirect('/artifact'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error', artifacts: cfg.artifacts() });
});

module.exports = app;
