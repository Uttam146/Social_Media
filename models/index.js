const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/dbConfig');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operationsAliases: false,
    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.idle
    }
});

sequelize.authenticate().then(()=>{console.log('DB is connected')}).catch((err)=>{
    console.log(err);
});
const db = {
    sequelize,
    Sequelize
}
db.users=require('./User')(sequelize,DataTypes);
db.sequelize.sync().then(()=>console.log("Sync successful!"));
module.exports = db;