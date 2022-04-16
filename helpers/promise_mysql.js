//connect db
var mysql = require('promise-mysql')


const host = 'localhost'
const user = 'root'
const password = ''
const database = 'lab6_node'

module.exports = mysql.createConnection({host,user,password,database})