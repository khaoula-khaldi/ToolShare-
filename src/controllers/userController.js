const AppError = require('../utils/AppError')

async function me(req, res) {
  res.status(200).json({ success: true, data: req.user });
}


module.exports = {me}