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

const verrouiller = async (id, dureeMs = 10000) => {
    const maintenant = new Date();
    return await Materiel.findOneAndUpdate(
        {
            _id: id,
            $or: [{ verrouReservation: null }, { verrouReservation: { $lte: maintenant } }]
        },
        { verrouReservation: new Date(maintenant.getTime() + dureeMs) },
        { returnDocument: 'after' }
    );
};

const deverrouiller = async (id) => {
    return await Materiel.updateOne({ _id: id }, { verrouReservation: null });
};

module.exports = {
    creer,
    trouverTous,
    trouverParId,
    modifierParId,
    verrouiller,
    deverrouiller
};