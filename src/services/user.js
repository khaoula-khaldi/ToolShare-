const mongoose = require("mongoose");
const  {create,findByEmailWithPassword} = require("../repositories/user.repo"); 
const { hashPassword } = require("./handlePassword");

const AppError = require("../utils/AppError");
const userRepository = require("../repositories/user.repo");
const magasinRepository = require("../repositories/magasinRepository");


async function handleCreateGestionnaire(role , data) {
    if(role !== 'admin'){
     throw new AppError('you do not have permission to create Gestionnaire' , 403);
    }

    const user = await findByEmailWithPassword(data.email);
    if(user) throw new AppError('email is already there' , 409);

    const hashPass = await hashPassword(data.password)
    const creation = await create({
        name : data.name,
        email : data.email,
        password : hashPass,
        role : 'gestionnaire'
    })

    return {
        name : creation.name,
        email : creation.email,
        role : creation.role
    }
}


const affecterMagasin = async (gestionnaireId, magasinId) => {
    if (!mongoose.isValidObjectId(gestionnaireId) ||!mongoose.isValidObjectId(magasinId)) {
        const error = new Error("Identifiant invalide");
        error.statusCode = 400;
        throw error;
    }

    const gestionnaire =await userRepository.findGestionnaireById(gestionnaireId);

    if (!gestionnaire) {
        const error = new Error("Gestionnaire introuvable");
        error.statusCode = 404;
        throw error;
    }

    const magasin = await magasinRepository.trouverParId(magasinId);

    if (!magasin) {
        const error = new Error("Magasin introuvable");
        error.statusCode = 404;
        throw error;
    }

    const gestionnaireExistant =
        await userRepository.findGestionnaireByMagasinId(magasinId);

    if (
        gestionnaireExistant &&
        gestionnaireExistant._id.toString() !== gestionnaireId.toString()
    ) {
        const error = new Error(
            "Ce magasin est déjà affecté à un autre gestionnaire"
        );
        error.statusCode = 409;
        throw error;
    }

    return userRepository.affecterMagasin(
        gestionnaireId,
        magasinId
    );
};


module.exports = {handleCreateGestionnaire,affecterMagasin}