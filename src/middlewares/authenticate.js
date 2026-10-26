
const jwt = require('jsonwebtoken');
const { findUserById } = require('../repositories/user.repo');

async function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Utilisateur introuvable' });
        }

        req.user = { id: user.id, email: user.email, name: user.name , role : user.role };

        next();
    } catch (err) {
        console.log(err);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', message: 'Token expiré' });
        }
        return res.status(401).json({ status: 'error', message: 'Token invalide' });
    }


}


module.exports = authMiddleware;