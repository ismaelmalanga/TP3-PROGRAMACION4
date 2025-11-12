import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute(
        "SELECT id_usuario, email FROM usuarios"
    );
    res.json({ success: true, usuarios: rows });
});

// Obtener usuario por ID
router.get(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            "SELECT id_usuario, email FROM usuarios WHERE id_usuario=?",
            [id]
        );
        if (rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
        res.json({ success: true, usuario: rows[0] });
    }
);

// crear usuario
router.post(
    "/",
    body("nombre").isAlpha("es-ES").isLength({ max: 50 }).withMessage("El nombre solo puede tener letras"),
    body("email").isEmail().withMessage("El email no es válido"),
    body("contraseña")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0,
        })
        .withMessage("La contraseña debe tener al menos 8 caracteres y un número"),
    verificarValidaciones,
    async (req, res) => {
        const { nombre, email, contraseña } = req.body;
        const hashed = await bcrypt.hash(contraseña, 12);

        try {
            await db.execute("INSERT INTO usuarios (nombre,email,contraseña) VALUES (?,?,?)", [
                nombre,
                email,
                hashed,
            ]);
            res.status(201).json({ success: true, message: "Usuario creado correctamente" });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ success: false, message: "El email ya está registrado" });
            }
            res.status(500).json({ success: false, message: "Error al crear el usuario" });
        }
    }
);


// Actualizar usuario
router.put(
    "/:id",
    verificarAutenticacion,
    validarId,
    body("email").isEmail(),
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { email } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM usuarios WHERE id_usuario=?",
            [id]
        );
        if (rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });

        await db.execute(
            "UPDATE usuarios SET email=? WHERE id_usuario=?",
            [email, id]
        );
        res.json({ success: true, message: "Usuario actualizado" });
    }
);

// Eliminar usuario
router.delete(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            "SELECT * FROM usuarios WHERE id_usuario=?",
            [id]
        );
        if (rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });

        await db.execute("DELETE FROM usuarios WHERE id_usuario=?", [id]);
        res.json({ success: true, message: "Usuario eliminado" });
    }
);

export default router;
