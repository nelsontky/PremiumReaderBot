const fs = require("promise-fs");

const dbPath = "./utils/st.json";

function writeToDb(obj) {
  fs.writeFile(dbPath, JSON.stringify(obj, null, 2));
}

async function readDb() {
  const db = await fs.readFile(dbPath, "utf8");
  return JSON.parse(db);
}

module.exports = { writeToDb, readDb };
