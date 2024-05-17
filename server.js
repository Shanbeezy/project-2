const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const axios = require('axios');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set MIME type for JavaScript files
app.get('*.js', function(req, res, next) {
  res.setHeader('Content-Type', 'application/javascript');
  next();
});

// Set MIME type for audio files
app.get('*.mp3', function(req, res, next) {
  res.setHeader('Content-Type', 'audio/mpeg');
  next();
});

// Set up Handlebars.js engine with custom helpers and directories for layouts and partials
const hbs = exphbs.create({
  helpers,
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: [
    path.join(__dirname, 'views', 'partials')
  ]
});

// Register the partial
hbs.handlebars.registerPartial('nav', '{{> nav}}');

// Session setup
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(routes);

// Starting the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
