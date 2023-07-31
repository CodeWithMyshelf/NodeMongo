const { MongoClient } = require("mongodb");
const assert = require("assert");

const circulationRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");
const { log } = require("console");

const dbURI = "mongodb://127.0.0.1:27017/";
const dbName = "rocker";

async function main() {
  const client = new MongoClient(dbURI);
  await client.connect();

  try {
    //Methodes and tests
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);

    const getData = await circulationRepo.get();
    // assert.equal(data.length, getData.length);

    const filterData = await circulationRepo.get({
      Newspaper: getData[4].Newspaper,
    });
    assert.deepEqual(filterData[0], getData[4]);

    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);

    //GetById
    const id = getData[4]._id;
    const getById = await circulationRepo.getById(id);
    assert.deepEqual(getById._id, getData[4]._id);

    //Post
    const newItem = {
      Newspaper: "Gefle dagblad",
      "Daily Circulation, 2004": 3000,
      "Daily Circulation, 2013": 6000,
      "Change in Daily Circulation, 2004-2013": -3000,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0,
    };
    const addedItem = await circulationRepo.add(newItem);
    assert(addedItem._id);
    const addedItemQuery = await circulationRepo.getById(addedItem._id);
    console.log("addedItemQuery :" + addedItemQuery._id);
    console.log("newItem        :" + newItem._id);
    assert.deepEqual(addedItemQuery, newItem);

    //TODO Update

    //Delete
    const removed = await circulationRepo.remove(addedItem._id);
    assert(removed);
    const deletedItem = await circulationRepo.getById(addedItem._id);
    console.log("Deleted : " + deletedItem);
    assert.equal(deletedItem, null);

    console.log(itemToUpdate);
  } catch (error) {
    console.log(error);
  } finally {
    const admin = client.db(dbName).admin();
    //console.log(await admin.listDatabases());

    await client.db(dbName).dropDatabase();
    //console.log(await admin.listDatabases());

    client.close();
  }
}

main();
