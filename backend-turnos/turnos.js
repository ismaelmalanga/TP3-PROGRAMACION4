import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtener todos los turnos
router.get("/", verificarAutenticacion, async (req, res) => {
    const [rows] = await db.execute(`
        SELECT t.id_turno, t.fecha, t.hora, t.estado, t.observaciones,
               p.nombre AS paciente, m.nombre AS medico
        FROM turnos t
        JOIN pacientes p ON t.id_paciente = p.id_paciente
        JOIN medicos m ON t.id_medico = m.id_medico
    `);
    res.json({ success: true, turnos: rows });
});

// obtener turno por ID
router.get(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const [rows] = await db.execute(
            "SELECT t.id_turno, t.fecha, t.hora, t.estado, t.observaciones, \
            p.nombre AS paciente, m.nombre AS medico \
            FROM turnos t \
            JOIN pacientes p ON t.id_paciente = p.id_paciente \
            JOIN medicos m ON t.id_medico = m.id_medico \
            WHERE t.id_turno = ?",
            [id]
        );

        if (rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Turno no encontrado" });

        res.json({ success: true, turno: rows[0] });
    }
);


// crear turno
router.post(
    "/",
    verificarAutenticacion,
    body("id_paciente").isInt({ min: 1 }),
    body("id_medico").isInt({ min: 1 }),
    body("fecha").isISO8601(),
    body("hora").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    verificarValidaciones,
    async (req, res) => {
        const { id_paciente, id_medico, fecha, hora } = req.body;
        const [turnoExistente] = await db.execute(
            "SELECT * FROM turnos WHERE id_paciente=? AND id_medico=? AND fecha=? AND hora=?",
            [id_paciente, id_medico, fecha, hora]
        );

        if (turnoExistente.length > 0) {
            return res.status(400).json({
                success: false,
                message: " Ya existe un turno para este paciente, médico, fecha y hora.",
            });
        }

        await db.execute(
            "INSERT INTO turnos (id_paciente, id_medico, fecha, hora, estado) VALUES (?,?,?,?, 'pendiente')",
            [id_paciente, id_medico, fecha, hora]
        );

        res.status(201).json({ success: true, message: "Turno creado correctamente" });
    }
);



// actualizar estado/observaciones del turno
router.put(
    "/:id",
    verificarAutenticacion,
    validarId,
    body("estado").isIn(["pendiente", "atendido", "cancelado"]),
    body("observaciones").optional().isString().isLength({ max: 255 }),
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { estado, observaciones } = req.body;

        const [rows] = await db.execute("SELECT * FROM turnos WHERE id_turno=?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Turno no encontrado",
            });
        }

        await db.execute(
            "UPDATE turnos SET estado=?, observaciones=? WHERE id_turno=?",
            [estado, observaciones || null, id]
        );

        res.json({ success: true, message: "Turno actualizado" });
    }
);

// eliminar turno
router.delete(
    "/:id",
    verificarAutenticacion,
    validarId,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);

        const [rows] = await db.execute("SELECT * FROM turnos WHERE id_turno=?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Turno no encontrado",
            });
        }

        await db.execute("DELETE FROM turnos WHERE id_turno=?", [id]);
        res.json({ success: true, message: "Turno eliminado" });
    }
);




export default router;
