import { useState } from "react";
import { Link } from "react-router-dom";

export const RegistroUsuario = () => {
    const [form, setForm] = useState({ nombre: "", email: "", contraseña: "" });
    const [mensaje, setMensaje] = useState("");
    const [exito, setExito] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setExito(false);

        try {
            const res = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje(" Usuario creado correctamente.");
                setExito(true);
                setForm({ nombre: "", email: "", contraseña: "" });
            } else {
                setMensaje(`⚠️ ${data.message || "Error al crear el usuario."}`);
            }
        } catch {
            setMensaje(" Error de conexión con el servidor.");
        }
    };

    return (
        <article className="registro-container">
            <h2>Crear usuario</h2>

            <form onSubmit={handleSubmit} className="registro-form">
                <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required
                />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                />
                <input type="password" placeholder="Contraseña" value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} required
                />
                <button>Registrar</button>
            </form>

            <p className="registro-aviso">🔒 La contraseña debe tener al menos <b>8 caracteres</b> y <b>un número</b>.</p>

            {mensaje && (<p className={`registro-mensaje ${exito ? "exito" : "error"}`}>{mensaje}</p>)}

            {exito && (<Link to="/" className="boton-volver">Volver al inicio de sesión</Link>)}
        </article>
    );
};
