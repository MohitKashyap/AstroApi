const mysql = require('mysql');
const config = require('./config');
const {host, user, password, name} = config.db;

var connection = mysql.createConnection({multipleStatements: true, host: host, user: user, password: password, database: name});

connection.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log('connected');
    }
});

module.exports = connection;