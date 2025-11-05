import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtener todos los pacientes
router.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute(
        "SELECT id_paciente, nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes"
    );
    res.json({ success: true, pacientes: rows });
});

// obtener paciente por ID
router.get(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            "SELECT id_paciente, nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes WHERE id_paciente=?",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });

        res.json({ success: true, paciente: rows[0] });
    }
);

// crear paciente
router.post(
    "/",
    verificarAutenticacion,
    body("nombre").isAlpha("es-ES").isLength({ max: 45 }),
    body("apellido").isAlpha("es-ES").isLength({ max: 45 }),
    body("dni").isNumeric().isLength({ min: 7, max: 10 }),
    body("fecha_nacimiento").isISO8601(),
    body("obra_social").isString().isLength({ max: 45 }),
    verificarValidaciones,
    async (req, res) => {
        const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

        await db.execute(
            "INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)",
            [nombre, apellido, dni, fecha_nacimiento, obra_social]
        );

        res.status(201).json({ success: true, message: "Paciente creado" });
    }
);

// actualizar paciente
router.put(
    "/:id",
    verificarAutenticacion,
    validarId,
    body("nombre").isAlpha("es-ES").isLength({ max: 45 }),
    body("apellido").isAlpha("es-ES").isLength({ max: 45 }),
    body("obra_social").isString().isLength({ max: 45 }),
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, apellido, obra_social } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM pacientes WHERE id_paciente=?",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });

        await db.execute(
            "UPDATE pacientes SET nombre=?, apellido=?, obra_social=? WHERE id_paciente=?",
            [nombre, apellido, obra_social, id]
        );

        res.json({ success: true, message: "Paciente actualizado" });
    }
);

// eliminar paciente
router.delete(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        const [rows] = await db.execute(
            "SELECT * FROM pacientes WHERE id_paciente=?",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });

        await db.execute("DELETE FROM pacientes WHERE id_paciente=?", [id]);
        res.json({ success: true, message: "Paciente eliminado" });
    }
);

export default router;
