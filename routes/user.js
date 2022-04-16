var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')

//connect db
var mysql = require('promise-mysql')
var connection

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login')
});

router.get('/register', function(req, res, next) {
  res.render('register')
});

router.post('/register', (req,res) => {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab6_node'
  })
    .then(conn => {
      connection = conn
      return conn.query(`select email from accounts where email = '${req.body.email}'`)
    })
    .then(value => {
      console.log(JSON.stringify(value))
      if(value.length !== 0){
        req.session.flash = {
          type: 'danger',
          intro: 'Dang ki that bai! ',
          message: 'Ten email da ton tai'
        }

        return res.redirect(303,'/user/register')
      }
      //hash pass
      var salt = bcrypt.genSaltSync(10)
      var hashedPass = bcrypt.hashSync(req.body.password,salt)

      return connection.query(
        `insert into accounts(fullName,email,password) values 
        ('${req.body.name}','${req.body.email}','${hashedPass}')
      `)
    })
    .then(response => {
      if(response.affectedRows < 1){
        req.session.flash = {
          type: 'danger',
          intro: 'Dang ki that bai! ',
          message: 'Unknown error'
        }

        return res.redirect(303,'/user/register')
      }

      //thanh con
      req.session.loginSession = {
        fullName: `${req.body.name}`,
        email: `${req.body.email}`
      }
      return res.redirect(303,'/')
    })
})

module.exports = router;
