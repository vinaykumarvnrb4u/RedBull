const path = require('path');
const express = require('express');
const cors = require('cors')

const buildFolder = './build';

const indexRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, buildFolder));
app.engine('html', require('ejs').renderFile);

app.use(
  '/static',
  express.static(path.join(__dirname, `${buildFolder}/static`)),
);

app.get('/', function(req, res) {
  res.render('index.html');
});

app.use('/api', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  // res.render('error');
});

module.exports = app;
