const User = require('../models/User');

async function create(data) {
  return  await User.create(data);

}

async function findByEmailWithPassword(email) {
  return  await User.findOne({email}).select('+password');
}
async function findByEmail(email) {
    return User.findOne({ email });
}
async function findUserById(id) {
  return await User.findById(id);
}


module.exports = {create,findUserById,findByEmail,findByEmailWithPassword}