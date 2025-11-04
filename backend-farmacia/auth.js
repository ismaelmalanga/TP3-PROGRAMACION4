import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { db } from "./db.js";
import { body } from "express-validator";
import { verificarValidaciones } from "./validaciones.js";

const router = express.Router();

export function authConfig() {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new Strategy(jwtOptions, async (payload, done) => {
            done(null, payload);
        })
    );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
    session: false,
});

// Login
router.post(
    "/login",
    body("email").isEmail().isLength({ max: 100 }),
    body("contraseña").isLength({ min: 8 }),
    verificarValidaciones,
    async (req, res) => {
        const { email, contraseña } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }

        const usuario = rows[0];
        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!esValida) {
            return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
        }

        const payload = { id_usuario: usuario.id_usuario, email: usuario.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ success: true, token, nombre: usuario.nombre, email: usuario.email });
    }
);

export default router;
