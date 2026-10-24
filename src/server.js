require("dotenv").config();
const express = require("express");
const errorHandler = require('./middlewares/ErrorHandler')
const connecterDB = require("./config/database");

const installationRoutes = require('./routes/installation.routes')
const materielRoutes = require("./routes/materielRoutes");
const magasinRoutes = require("./routes/magasinRoutes");
const authRoutes = require("./routes/auth.routes");
const gestionnaireUser = require("./routes/gestionnaireUser.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenue dans l'API ToolShare"
    });
});

app.use('/api/installation' , installationRoutes )
app.use("/api/materiels", materielRoutes);
app.use("/api/magasins", magasinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/createUser",gestionnaireUser);


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


app.use(errorHandler);
demarrerServeur();
