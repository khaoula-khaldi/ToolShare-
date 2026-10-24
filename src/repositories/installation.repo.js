const Installation = require('../models/installation');


const getOrCreate = async (session) =>
  await Installation.findOneAndUpdate(
    { key: 'singleton' }, 
    { $setOnInsert: { key: 'singleton' } },
    { returnDocument: 'after', upsert: true, session }
  );


const markInstalled = async (session) =>
  await Installation.findOneAndUpdate(
    { key: 'singleton', installed: false },
    { installed: true, installedAt: new Date() },
    { returnDocument: 'after', session }
  );

module.exports = { getOrCreate, markInstalled }