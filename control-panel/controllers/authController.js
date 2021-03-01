const MongoClient = require('mongodb');
const dbUrl = process.env.DB_CONNECTION;

let records;

MongoClient.connect(dbUrl, (error, database) => {
  if (error) return process.exit(1);

  const db = database.db(process.env.DB)
  const collection = db.collection('users');

  collection.find().toArray((err, users) => {
    records = users;
  });
});

exports.findById = function(id, cb) {
  process.nextTick(function() {

    const found = records.find(function (item) {
      return String(item['_id']) === id;
    });
    console.log('found?' + found);
    if (found) {
      const getIndex = records.findIndex((item) => String(item['_id']) === id);
      cb(null, records[getIndex]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(user, cb) {
  const username = user.toLowerCase().trim();
  process.nextTick(function() {
    for (let i = 0, len = records.length; i < len; i++) {
      const record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, false);
  });
}
