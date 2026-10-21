require("dotenv").config();

const express = require("express");
const connecterDB = require("./config/database");

const materielRoutes = require("./routes/materielRoutes");
const magasinRoutes = require("./routes/magasinRoutes");


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenue dans l'API ToolShare"
    });
});

app.use("/api/materiels", materielRoutes);
app.use("/api/magasins", magasinRoutes);


const demarrerServeur = async () => {
    try {
        await connecterDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`ToolShare API running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Erreur au démarrage :", error.message);
        process.exit(1);
    }
};

demarrerServeur();
