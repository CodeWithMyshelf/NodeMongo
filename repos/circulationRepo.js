const { MongoClient, ObjectId } = require("mongodb");
const dbURI = "mongodb://127.0.0.1:27017/";
const dbName = "rocker";

function circulationRepo() {
  //TODO Put https://www.youtube.com/watch?v=XLsq6-biy5I  && https://github.com/CodeWithMyshelf/NodeAPI/blob/main/API/app.js

  function remove(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(dbURI);
      try {
        await client.connect();
        const db = client.db(dbName);
        const removedResult = await db
          .collection("newspapers")
          .deleteOne({ _id: new ObjectId(id) });
        resolve(removedResult.deletedCount == 1);
        client.close();
      } catch (error) {}
    });
  }

  async function add(item) {
    const client = new MongoClient(dbURI);
    try {
      await client.connect();
      const db = client.db(dbName);
      const insertResult = await db.collection("newspapers").insertOne(item);
      const addedItem = { ...item, _id: insertResult.insertedId }; // Add _id to newItem
      return addedItem;
    } catch (error) {
      throw error;
    } finally {
      client.close();
    }
  }

  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(dbURI);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db
          .collection("newspapers")
          .findOne({ _id: new ObjectId(id) });
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(dbURI);
      try {
        const db = client.db(dbName);

        let items = db.collection("newspapers").find(query);

        if (limit > 0) {
          items = items.limit(limit);
        }

        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(dbURI);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection("newspapers").insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  return { loadData, get, getById, add, remove, update };
}

module.exports = circulationRepo();
