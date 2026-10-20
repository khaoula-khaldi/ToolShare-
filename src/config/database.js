
const mongoose = require("mongoose");

const connecterDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connectée");
    } catch (error) {
        console.error("Erreur de connexion MongoDB :", error.message);
        throw error;
    }
};

module.exports = connecterDB;
