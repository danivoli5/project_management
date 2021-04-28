const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

const app =express()

const PORT = process.env.PORT || 3000

//DB Connect
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//set view engine
app.use(expressLayouts)
app.set("view engine","ejs")

//BodyParser
app.use(express.urlencoded({extended:false}))

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


app.listen(PORT,console.log("Server started on PORT:"+PORT))