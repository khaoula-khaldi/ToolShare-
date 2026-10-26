const { handleCreateGestionnaire } = require('../services/user');
const AppError = require('../utils/AppError')


async function me(req, res) {
  res.status(200).json({ success: true, data: req.user });
}

async function createGestionnaire(req,res) {
  const gestionnaire = await handleCreateGestionnaire(req.user.role,req.body)
  return res.status(201).json({success : true , data : gestionnaire});
}
module.exports = {me,createGestionnaire}