const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/databaseConnection');

// Database Connection
const mongoose = require('mongoose');

mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true});

let database = mongoose.connection;

// Checking database connection
// If database is working fine
database.once('open', function(err){
  console.log('Successfully connected to Database');  
});
// If database is not working properly
database.on('error', function(err){
  console.log("Database is not connected")
});

// Initialize App
const app = express();

// Setting up body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Setting up public folder
app.use(express.static(path.join(__dirname, 'public'))); 

// Models Setup
let Post = require('./models/post');

// Tempelate Engine Setup (Pug) 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Configuration
require('./config/auth_passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Page Route
app.get('/', function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Posts',
        posts: posts
      });
    }
  });
});

// All Route Files
let posts = require('./routes/posts');
let users = require('./routes/users');
app.use('/posts', posts);
app.use('/users', users);

// Starting Server
const port = 3000;
app.listen(port, () =>
  console.log(`PostIt app listening at http://localhost:${port}`)
);

