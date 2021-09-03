const MongoCLient = require('mongodb').MongoClient;

let _db;

const mongoConnect = _ =>
  new Promise((res, reject) => {
    MongoCLient.connect(
      'mongodb+srv://bk:admin9@cluster0.tjbjo.mongodb.net/shop?retryWrites=true&w=majority'
    )
      .then(client => {
        _db = client.db();
        res(client);
      })
      .catch(err => reject(err));
  });

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
