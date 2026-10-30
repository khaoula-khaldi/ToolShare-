const jwt = require('jsonwebtoken');
const { findByEmail } = require('../repositories/user.repo');
const {checkPassword} = require('./handlePassword')
const AppError = require('../utils/AppError');

const INVALID_CREDENTIALS = 'Email ou mot de passe incorrect';

const loginUser = async ({ email, password }) => {
  const user = await findByEmail(email , true);
  console.log(user)
  if (!user) {
    throw new AppError(INVALID_CREDENTIALS, 401);
  }

  const isMatch = await checkPassword(password, user.password);
  if (!isMatch) {
    throw new AppError(INVALID_CREDENTIALS, 401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = { loginUser };