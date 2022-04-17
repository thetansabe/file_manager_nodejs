var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var fs = require('fs')
var path = require('path')
var multiparty = require('multiparty')

/* GET home page. */
const checkLogin = (req,res,next) => {
  const cookie = req.cookies.login
  const session = req.res.locals.loginSession

  if(cookie || session)  return next()
  req.session.flash = {
    'type' : 'danger',
    'intro' : 'Ban phai dang nhap! ',
    'message': ''
  }
  return res.redirect(303,'/user')
  
}


//xu li file manager
const getFileInfoFromFolder = (route) => {
  const files = fs.readdirSync(route, 'utf8')
  const response = [];

  for (let file of files) {
    const extension = path.extname(file)
    const filePath = route+'/'+file
    const fileSizeInBytes = fs.statSync(filePath).size
    const lastModify = fs.statSync(filePath).mtime
    response.push({ name: file, extension, fileSizeInBytes, lastModify });
  }

  return response;
}

router.get('/',checkLogin, function(req, res, next) {
  //json thong tin tung file
  const files = getFileInfoFromFolder('./public/uploads')
  console.log(files)

  res.render('index', {files});
});


//xu li login
var mySqlConn = require('../helpers/promise_mysql');
const { dir } = require('console');
var connection 

router.post('/login', (req,res) => {
  //validate server side
  mySqlConn
    .then(conn => {
      connection = conn
      return conn.query(`select * from accounts where email = '${req.body.email}'`)
    })
    .then(value => {
      //dung email
      if(value.length == 1){
        const data = {
          fullName: value[0].fullName,
          email: value[0].email
        }

        ///////check pass
        const hashedPass = value[0].password
        const cmp = bcrypt.compareSync(req.body.password, hashedPass)
        //dung pass
        if(cmp){
          //moi thu dung het
          if(req.body.remember == 'on'){
            //luu cookie
            res.cookie('login', data)
          }
          //thanh cong 
          req.session.loginSession = data
          return res.redirect(303,'/')

        }
        //sai pass
        req.session.flash = {
          'type' : 'danger',
          'intro' : 'Dang nhap that bai! ',
          'message': 'Sai password'
        }
        return res.redirect(303,'/user')
      }
      //sai email
      req.session.flash = {
        'type' : 'danger',
        'intro' : 'Dang nhap that bai! ',
        'message': 'Tai khoan khong ton tai'
      }
      return res.redirect(303,'/user')

    })

})

//xu li upload 
router.post('/handle_file', (req, res) => {
  
  const form = new multiparty.Form()

  form.parse(req, (err,fields,files) => {
    if(err) throw err

    const myFiles = files.uploadFile

    myFiles.forEach(file => {

      const invalidExt = ['exe','msi','sh']
      const fileExt = file.originalFilename.split('.')[1]
      //console.log(fileExt)
      if(invalidExt.includes(fileExt)){
        req.session.flash = {
          'type' : 'danger',
          'intro': 'Upload Failed! ',
          'message': 'Invalid file type'
        }

        return res.redirect(303,'/')
      }

      if(parseInt(file.size) > 5*1024*1024){
        req.session.flash = {
          'type' : 'danger',
          'intro': 'Upload Failed! ',
          'message': 'Cannot upload more than 5 MB'
        }

        return res.redirect(303,'/')
      }

      const oldPath = file.path
      const newPath = __dirname+'/../public/uploads/'+file.originalFilename

      fs.copyFile(oldPath, newPath, function (err) {
        if (err) throw err;
            console.log('Successfully renamed - AKA moved!');
      })

      
    })
  })

  req.session.flash = {
    'type' : 'success',
    'intro': 'Upload Success! ',
    'message': ''
  }

  return res.redirect(303,'/')
})


router.get('/get_files', (req,res) => {
  const myFiles = getFileInfoFromFolder('./public/uploads')

  return res.send(JSON.stringify(myFiles))
})
module.exports = router;
