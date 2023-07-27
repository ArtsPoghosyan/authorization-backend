const mysql2 = require("mysql2");
const { Sequelize } = require("sequelize");
const {MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD} = process.env;

try{
    const db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        dialect: 'mysql',
        logging:false,
    });

    console.log("Database Connected");

    module.exports = db;
}catch(err){
    console.log(err);
}
