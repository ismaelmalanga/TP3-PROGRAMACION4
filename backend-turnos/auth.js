import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new Strategy(jwtOptions, async (payload, next) => {
            next(null, payload);
        })
    );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
    session: false,
});

router.post(
    "/login",
    body("email", "Email inválido").isEmail().isLength({ max: 100 }),
    body("password", "Contraseña inválida").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
    }),
    verificarValidaciones,
    async (req, res) => {
        const { email, password } = req.body;

        
        const [usuarios] = await db.execute(
            "SELECT * FROM usuarios WHERE email=?",
            [email]
        );

        if (usuarios.length === 0) {
            return res
                .status(400)
                .json({ success: false, error: "Email inválido o no registrado" });
        }

        
        const hashedPassword = usuarios[0].contraseña;
        const passwordComparada = await bcrypt.compare(password, hashedPassword);

        if (!passwordComparada) {
            return res
                .status(400)
                .json({ success: false, error: "Contraseña incorrecta" });
        }

        
        const payload = { userId: usuarios[0].id_usuario };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

        res.json({
            success: true,
            token,
            email: usuarios[0].email,
        });
    }
);

export default router;
