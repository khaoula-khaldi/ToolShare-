
const Materiel = require("../models/Materiel");

const creer = async (data) => {
    return await Materiel.create(data);
};

const trouverTous = async (filtres = {}) => {
    return await Materiel.find(filtres);
};

const trouverParId = async (id) => {
    return await Materiel.findById(id);
};

const modifierParId = async (id, data) => {
    return await Materiel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true
    });
};

module.exports = {
    creer,
    trouverTous,
    trouverParId,
    modifierParId
};
