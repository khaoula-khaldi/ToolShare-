const installationService = require('../services/installation');
const AppError = require('../utils/AppError');


const getStatus =async (req, res) => {
  const status = await installationService.getStatus();
  res.status(200).json({ success: true, data: status });
};

const install = async (req, res) => {
  const admin = await installationService.install(req.body);
  res.status(201).json({ success: true,message: 'Installation réussie',data: admin});
};

module.exports = { getStatus, install };