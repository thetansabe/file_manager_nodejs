var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { engine } = require('express-handlebars')
////my libs


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

//// view engine setup
app.engine('.hbs', engine({
  defaultLayout:'main',
  extname: '.hbs',
  helpers: {
    matchIcon: function(extension){
      if(extension == ''){
        return '<i class="fa fa-folder"></i>'
      }

      if(extension == '.zip'){
        return '<i class="fas fa-file-archive"></i>'
      }

      if(extension == '.png' || extension == '.jpg' 
      || extension == '.sgv' || extension == '.jpeg'){
        return '<i class="fas fa-file-image"></i>'
      }

      //default icon file
      return '<i class="fas fa-file"></i>'
    },
    matchType: function(extension){
      if(extension == ''){
        return 'Folder'
      }

      if(extension == '.zip'){
        return 'Compressed file'
      }

      if(extension == '.png' || extension == '.jpg' 
      || extension == '.sgv' || extension == '.jpeg'){
        return 'Image'
      }

      //default icon file
      return 'Text file'
    },
    matchSize: function(size){
      if (size == 0) return '-'
      const kb = Math.round(size/1024, -1)
      return kb > 1? `${kb} KB` : `${size} B`
    }
  }
}))
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

//connect.end
////important middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('mycookiekey'));
app.use(require('express-session')())
app.use(express.static(path.join(__dirname, 'public')));

//flash msg
app.use((req,res,next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

//session dang nhap
app.use((req,res,next) => {
  res.locals.loginSession = req.session.loginSession
  delete req.session.loginSession
  next()
})

//cookie
app.use((req,res,next) => {
  res.locals.loginCookie = req.cookies.login
  next()
})

////ROUTING
app.use('/', indexRouter);
app.use('/user', usersRouter);

//// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
