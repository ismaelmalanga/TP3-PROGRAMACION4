import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth.jsx";

export const Layout = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="app-layout">
            <header className="navbar">
                <nav className="nav-container">
                    <ul className="nav-list">
                        <li><Link to="/">Inicio</Link></li>
                        {isAuthenticated && (
                            <>
                                <li><Link to="/pacientes">Pacientes</Link></li>
                                <li><Link to="/medicos">Médicos</Link></li>
                                <li><Link to="/turnos">Turnos</Link></li>
                                <li><button onClick={logout} className="logout-btn">Cerrar sesión</button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
