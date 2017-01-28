import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

var db = {};

const sequelize = new Sequelize('wordnet', 'user', 'password',
    {
        dialect: 'sqlite',
        storage: 'db/sqlite-31_snapshot.db'
    }
);

// Sequelize makes you import each model file individually :/
// Source: https://github.com/sequelize/express-example/blob/master/models/index.js

const model_dir = __dirname + "/models";

fs
  .readdirSync(model_dir)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(model_dir, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
console.log(sequelize.showAllSchemas());
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
