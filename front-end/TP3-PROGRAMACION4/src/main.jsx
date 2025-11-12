import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { RegistroUsuario } from "./Componentes/RegistroUsuario.jsx";


import { AuthPage, AuthProvider } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Pacientes } from "./Componentes/Pacientes.jsx";
import { CrearPaciente } from "./Componentes/CrearPaciente.jsx";
import { ModificarPaciente } from "./Componentes/ModificarPaciente.jsx";
import { DetallesPaciente } from "./Componentes/DetallesPaciente.jsx";
import { Medicos } from "./Componentes/Medicos.jsx";
import { CrearMedico } from "./Componentes/CrearMedico.jsx";
import { ModificarMedico } from "./Componentes/ModificarMedico.jsx";
import { DetallesMedico } from "./Componentes/DetallesMedico.jsx";
import { Turnos } from "./Componentes/Turnos.jsx";
import { CrearTurno } from "./Componentes/CrearTurno.jsx";
import { ModificarTurno } from "./Componentes/ModificarTurno.jsx";
import { DetallesTurno } from "./Componentes/DetallesTurno.jsx";


createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="registro" element={<RegistroUsuario />} />
                        
                        
                        <Route path="pacientes" element={<AuthPage><Pacientes /></AuthPage>} />
                        <Route path="pacientes/crear" element={<AuthPage><CrearPaciente /></AuthPage>} />
                        <Route path="pacientes/:id" element={<AuthPage><DetallesPaciente /></AuthPage>} />
                        <Route path="pacientes/:id/modificar" element={<AuthPage><ModificarPaciente /></AuthPage>} />

                        
                        <Route path="medicos" element={<AuthPage><Medicos /></AuthPage>} />
                        <Route path="medicos/crear" element={<AuthPage><CrearMedico /></AuthPage>} />
                        <Route path="medicos/:id" element={<AuthPage><DetallesMedico /></AuthPage>} />
                        <Route path="medicos/:id/modificar" element={<AuthPage><ModificarMedico /></AuthPage>} />

                        
                        <Route path="turnos" element={<AuthPage><Turnos /></AuthPage>} />
                        <Route path="turnos/crear" element={<AuthPage><CrearTurno /></AuthPage>} />
                        <Route path="turnos/:id" element={<AuthPage><DetallesTurno /></AuthPage>} />
                        <Route path="turnos/:id/modificar" element={<AuthPage><ModificarTurno /></AuthPage>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
