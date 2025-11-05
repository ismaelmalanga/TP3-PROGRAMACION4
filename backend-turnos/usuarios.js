import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtengo todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute("SELECT id_usuario, nombre, email FROM usuarios");

    // oculto contraseñas
    res.json({
        success: true,
        usuarios: rows.map((u) => ({ ...u, contraseña: undefined })),
    });
});

// obtengo usuarios por ID
router.get(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            "SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario=?",
            [id]
        );

        if (rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
        }

        res.json({ success: true, usuario: rows[0] });
    }
);

// creo usuario nuevo
router.post(
    "/",
    body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
    body("email", "Email inválido").isEmail().isLength({ max: 100 }),
    body("contraseña", "Contraseña inválida").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
    }),
    verificarValidaciones,
    async (req, res) => {
        const { nombre, email, contraseña } = req.body;

        //contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(contraseña, 12);

        const [result] = await db.execute(
            "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
            [nombre, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, email },
        });
    }
);

// elimino usuario
router.delete(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        await db.execute("DELETE FROM usuarios WHERE id_usuario=?", [id]);
        res.json({ success: true, data: id });
    }
);

export default router;
