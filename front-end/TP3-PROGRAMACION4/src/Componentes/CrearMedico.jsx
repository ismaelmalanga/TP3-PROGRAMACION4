import { useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useNavigate } from "react-router-dom";

export const CrearMedico = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        nombre: "", apellido: "", especialidad: "", matricula: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAuth("http://localhost:3000/medicos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        navigate("/medicos");
    };

    return (
        <article>
            <h2>Nuevo Médico</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Nombre" value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} required />
                <input placeholder="Apellido" value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} required />
                <input placeholder="Especialidad" value={values.especialidad} onChange={(e) => setValues({ ...values, especialidad: e.target.value })} required />
                <input placeholder="Matrícula" value={values.matricula} onChange={(e) => setValues({ ...values, matricula: e.target.value })} required />
                <button>Crear</button>
            </form>
        </article>
    );
};
