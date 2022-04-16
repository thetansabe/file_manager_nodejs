const mysql = require('mysql')

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab6_node'
})

connect.connect((err) => {
    if(!!err){
        console.log('error: ',err)
    }else{
        console.log('connected db')
    }
})

module.exports = connect