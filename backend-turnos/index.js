import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { conectarDB } from "./db.js";

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    await conectarDB();
    app.listen(PORT, () =>
        console.log(`Corriendo en puerto ${PORT}`)
    );
};

iniciarServidor();
