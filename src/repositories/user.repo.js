const User = require('../models/User');

async function create(data) {
  return  await User.create(data);

}


module.exports = {create }