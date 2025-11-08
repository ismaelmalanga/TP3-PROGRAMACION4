import { useState } from "react";
import { useAuth } from "./Auth.jsx";

export const Home = () => {
    const { isAuthenticated, login, error } = useAuth();
    const [cred, setCred] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(cred.email, cred.password);
    };

    if (isAuthenticated) {
        return <h2>Bienvenido al sistema de turnos </h2>;
    }

    return (
        <article>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={cred.email}
                    onChange={(e) => setCred({ ...cred, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={cred.password}
                    onChange={(e) => setCred({ ...cred, password: e.target.value })}
                    required
                />
                <button>Entrar</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </article>
    );
};
