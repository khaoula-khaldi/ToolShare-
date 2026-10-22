function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur serveur";

  // Duplicate key (référence/email déjà utilisé)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} déjà utilisé`;
  }

  // Erreur de validation Mongoose (champ manquant, enum invalide...)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // ObjectId invalide (id malformé dans l'URL)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Id invalide: ${err.value}`;
  }

  // JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = "Token invalide";
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = "Token expiré";
  }

  res.status(statusCode).json({ status: 'error', message });
}

module.exports = errorHandler;