if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const favicon = require('static-favicon');
const exphbs = require('express-handlebars');
const hbs = require('handlebars'); 
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { database } = require('./keys');
const requests = require("request");
//const { get } = require('request')
const config = require('./config.js');
//const buffer = require('buffer').Buffer
//const faceapi = require("face-api.js");

// Intializations
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
//app.use(express.raw({type: 'image/*', limit: '160kb'}))
//app.use(bodyParser.raw({type: 'image/*', limit: '160kb'}))
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 7500);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
//app.set('view engine', '.hbs'); esta linea es la original

//hbs.registerHelper('ifeq', function(v1, v2, options) {
//  if(v1 === v2) {
//    return options.fn(this);
//  } else {
//  return options.fn(this);
//  }
//});

hbs.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and: function () {
      return Array.prototype.slice.call(arguments).every(Boolean);
  },
  or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});
 
//app.set('view engine', 'handlebars'); 
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(favicon());
app.use(session({
  secret: 'faztmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
var gfecha = new Date();
var mtoken = '';
var memail = '';
var idusr = 0;

app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;       
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/alumnos', require('./routes/routesalumnos'));
app.use('/entregas', require('./routes/routesentregas'));
app.use('/medidas', require('./routes/routesmedidas'));
app.use('/sedes', require('./routes/routessedes'));
app.use('/users', require('./routes/routesusers'));
app.use('/querys', require('./routes/routesquery'));
app.use('/mensajes', require('./routes/routesenvios'));

// Public
app.use(express.static(path.join(__dirname, 'public')));
//Modelos
app.use(express.static(path.join(__dirname, '../models')))

//Errores
app.use((error, req, res, next) => {
  res.status(400).json({
      status: 'error',
      message: error.message,
  });
});

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

/* function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
} */