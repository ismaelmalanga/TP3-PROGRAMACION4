import { useState } from "react";
import { useAuth } from "./Auth.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
    const { isAuthenticated, login, error } = useAuth();
    const [cred, setCred] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(cred.email, cred.password);
    };

    if (isAuthenticated) {
        return (
            <section className="bienvenida">
                <h2>Bienvenido al sistema de turnos</h2>
                <p>
                    Desde aquí podrás gestionar fácilmente los <b>pacientes</b>, <b>médicos</b> y <b>turnos</b>.<br />
                    Utilizá el menú superior para acceder a cada sección.
                </p>
            </section>
        );
    }

    return (
        <article className="login-container">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} required
                />
                <input type="password" placeholder="Contraseña" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} required
                />
                <button>Entrar</button>
            </form>
            {error && <p className="error">{error}</p>}

            <p className="registro-link">
                ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
            </p>
        </article>
    );
};
