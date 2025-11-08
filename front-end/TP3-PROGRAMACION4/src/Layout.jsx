import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth.jsx";

export const Layout = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <main className="container">
            <nav>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    {isAuthenticated && (
                        <>
                            <li><Link to="/pacientes">Pacientes</Link></li>
                            <li><Link to="/medicos">Médicos</Link></li>
                            <li><Link to="/turnos">Turnos</Link></li>
                            <li><button onClick={logout}>Cerrar sesión</button></li>
                        </>
                    )}
                </ul>
            </nav>
            <Outlet />
        </main>
    );
};
