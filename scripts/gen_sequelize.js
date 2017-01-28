import SequelizeAuto from 'sequelize-auto';
import path from 'path';

const db_path = path.resolve('db/sqlite-31_snapshot.db');
console.log(db_path);

var auto = new SequelizeAuto(db_path, 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    directory: 'db/models',
    storage: db_path
});

auto.run(function (err) {
  if (err) throw err;
  // console.log(auto.tables); // table list
  // console.log(auto.foreignKeys); // foreign key list
});
