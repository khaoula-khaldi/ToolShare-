const authorization = function (req, res, next) {
    const { role } = req.user;
    if (role !== "gestionnaire") {
        return res.status(403).json({
            message: "Erreur de permission"
        });
    }
    next();
};

module.exports = authorization;