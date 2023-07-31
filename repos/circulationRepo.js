const { MongoClient } = require("mongodb");
const dbURI = "mongodb://127.0.0.1:27017/";
const dbName = "rocker";

function circulatinRepo() {
  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(dbURI);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection("newspapers").insertMany(data);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }
  return { loadData };
}

module.exports = circulatinRepo();
