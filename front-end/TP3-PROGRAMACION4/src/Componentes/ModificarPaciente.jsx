import { useState, useEffect } from "react";
import { useAuth } from "../Auth.jsx";
import { useParams, useNavigate } from "react-router-dom";

export const ModificarPaciente = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            const res = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
            const data = await res.json();
            setValues(data.paciente);
        };
        cargar();
    }, [fetchAuth, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        navigate("/pacientes");
    };

    if (!values) return null;

    return (
        <article>
            <h2>Modificar Paciente</h2>
            <form onSubmit={handleSubmit}>
                <input value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
                <input value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} />
                <input value={values.dni} onChange={(e) => setValues({ ...values, dni: e.target.value })} />
                <input type="date" value={values.fecha_nacimiento} onChange={(e) => setValues({ ...values, fecha_nacimiento: e.target.value })} />
                <input value={values.obra_social} onChange={(e) => setValues({ ...values, obra_social: e.target.value })} />
                <button>Guardar</button>
            </form>
        </article>
    );
};
