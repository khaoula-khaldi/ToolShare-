const bcrypt = require('bcrypt');
const {markInstalled ,getOrCreate} = require('../repositories/installation.repo');
const {create} = require('../repositories/user.repo');
const AppError = require('../utils/AppError');

const getStatus = async () => {
  const installation = await getOrCreate();
  return { installed: installation.installed };
};

const install = async ({name,email,password}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

    await getOrCreate();

    const installation = await markInstalled();
    if (!installation) {
      throw new AppError('Application déjà installée', 409);
    }

    const admin = await create({ name,email, password: hashedPassword, role: 'admin' });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

};

module.exports = { getStatus, install };