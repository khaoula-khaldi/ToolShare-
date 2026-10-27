const { handleCreateGestionnaire } = require('../services/user');
const AppError = require('../utils/AppError')
const userService = require("../services/user");


async function me(req, res) {
  res.status(200).json({ success: true, data: req.user });
}

async function createGestionnaire(req,res) {
  const gestionnaire = await handleCreateGestionnaire(req.user.role,req.body)
  return res.status(201).json({success : true , data : gestionnaire});
}

const affecterMagasin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { magasinId } = req.body;

        const resultat = await userService.affecterMagasin(
            id,
            magasinId
        );

        res.status(200).json({
            message: "Magasin affecté avec succès",
            data: resultat
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {me,createGestionnaire,affecterMagasin}