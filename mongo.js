const dbURI = "mongodb://127.0.0.1:27017/";
const dbName = "rocker";
const { MongoClient } = require("mongodb");
const circulatinRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");

async function main() {
  const client = new MongoClient(dbURI);
  await client.connect();

  const results = await circulatinRepo.loadData(data);

  console.log(results.insertedCount, results.ops);
  const admin = client.db(dbName).admin();
  // console.log(await admin.serverStatus());
  console.log(await admin.listDatabases());
}

main();
