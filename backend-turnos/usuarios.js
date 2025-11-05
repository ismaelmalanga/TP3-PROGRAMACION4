import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtener todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute(
        "SELECT id_usuario, nombre, email FROM usuarios"
    );
    res.json({ success: true, usuarios: rows });
});

// obtener usuario por ID
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
    body("nombre").isAlpha("es-ES").isLength({ max: 50 }),
    body("email").isEmail(),
    body("contraseña").isLength({ min: 8 }),
    verificarValidaciones,
    async (req, res) => {
        const { nombre, email, contraseña } = req.body;
        const hashed = await bcrypt.hash(contraseña, 12);
        await db.execute("INSERT INTO usuarios (nombre,email,contraseña) VALUES (?,?,?)", [
            nombre,
            email,
            hashed,
        ]);
        res.status(201).json({ success: true, message: "Usuario creado" });
    }
);

// actualizar usuario
router.put(
    "/:id",
    verificarAutenticacion,
    validarId,
    body("nombre").isAlpha("es-ES").isLength({ max: 50 }),
    body("email").isEmail(),
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, email } = req.body;
        const [rows] = await db.execute(
            "SELECT * FROM usuarios WHERE id_usuario=?",
            [id]
        );
        if (rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });

        await db.execute(
            "UPDATE usuarios SET nombre=?, email=? WHERE id_usuario=?",
            [nombre, email, id]
        );
        res.json({ success: true, message: "Usuario actualizado" });
    }
);

// eliminar usuario
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
