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

const findGestionnaireById = async (id) => {
    return User.findOne({
        _id: id,
        role: "gestionnaire"
    });
};

const findGestionnaireByMagasinId = async (magasinId) => {
    return User.findOne({
        magasinId,
        role: "gestionnaire"
    });
};

const affecterMagasin = async (gestionnaireId, magasinId) => {
    return User.findByIdAndUpdate(
        gestionnaireId,
        { magasinId },
        { new: true, runValidators: true }
    );
};


module.exports = {create,findUserById,findByEmail,findByEmailWithPassword,findGestionnaireById,findGestionnaireByMagasinId,affecterMagasin}