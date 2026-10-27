
const Magasin = require("../models/Magasin");

const creer = async (data) => {
    return await Magasin.create(data);
};

const trouverTous = async () => {
    return await Magasin.find();
};

const trouverParId = async (id) => {
    return await Magasin.findById(id);
};

const modifierParId = async (id, data) => {
    return await Magasin.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true
    });
};
const supprimerParId = async (id) => {
    return await Magasin.findByIdAndDelete(id);
};

const disactiveMagasin = async (id) => {
  return await Magasin.findByIdAndUpdate(
    id,
    { actif: false },
    { returnDocument: "after", runValidators: true }
  );
};


module.exports = {
    creer,
    trouverTous,
    trouverParId,
    modifierParId,
    supprimerParId,
    disactiveMagasin,
};
