const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'myProject';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connect() {
  if (!db) {
    try {
      await client.connect();
      console.log('Connected successfully to MongoDB server');
      db = client.db(dbName);
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }
}

function getDb() {
  return db;
}

module.exports = {
  connect,
  getDb,
};
