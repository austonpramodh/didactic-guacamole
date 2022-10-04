
const mongodbSnapShot = require('mongodb-snapshot');
const { MongoDBDuplexConnector, LocalFileSystemDuplexConnector, MongoTransferer } = mongodbSnapShot;
const path = require('path');

const username = "bindu_1";
const password = "GKk90fjyoYC19Z5t";
const dbname = "chichat-dev";

async function dumpMongo2Localfile() {
  const mongo_connector = new MongoDBDuplexConnector({
    connection: {
      uri: `mongodb+srv://${username}:${password}@cluster0.alayz.azure.mongodb.net/?retryWrites=true&w=majority`,
      dbname: dbname,
      isAtlasFreeTier: true
    },
  });

  const localpath = path.join(__dirname, 'dump', `/backup.tar`);
  const localfile_connector = new LocalFileSystemDuplexConnector({
    connection: {
      path: localpath,
    },
  });

  const transferer = new MongoTransferer({
    source: mongo_connector,
    targets: [localfile_connector],
  });

  console.log('start transfer');

  for await (const { total, write } of transferer) {
    console.log(`remaining bytes to write: ${total - write} out of ${total}`);
  }
}


dumpMongo2Localfile()