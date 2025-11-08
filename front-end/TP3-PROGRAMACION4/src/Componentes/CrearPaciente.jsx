import { useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useNavigate } from "react-router-dom";

export const CrearPaciente = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        nombre: "", apellido: "", dni: "", fecha_nacimiento: "", obra_social: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAuth("http://localhost:3000/pacientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        navigate("/pacientes");
    };

    return (
        <article>
            <h2>Nuevo Paciente</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Nombre" value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} required />
                <input placeholder="Apellido" value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} required />
                <input placeholder="DNI" value={values.dni} onChange={(e) => setValues({ ...values, dni: e.target.value })} required />
                <input type="date" value={values.fecha_nacimiento} onChange={(e) => setValues({ ...values, fecha_nacimiento: e.target.value })} required />
                <input placeholder="Obra Social" value={values.obra_social} onChange={(e) => setValues({ ...values, obra_social: e.target.value })} required />
                <button>Crear</button>
            </form>
        </article>
    );
};
