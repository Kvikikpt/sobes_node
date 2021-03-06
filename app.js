const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {db} = require('./db');
const init_db = require('./db/init')

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

init_db(db);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
