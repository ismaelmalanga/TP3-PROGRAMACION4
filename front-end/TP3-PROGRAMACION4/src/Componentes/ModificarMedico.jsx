import { useEffect, useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarMedico = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            const res = await fetchAuth(`http://localhost:3000/medicos/${id}`);
            const data = await res.json();
            setValues(data.medico);
        };
        cargar();
    }, [fetchAuth, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAuth(`http://localhost:3000/medicos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        navigate("/medicos");
    };

    if (!values) return null;

    return (
        <article>
            <h2>Modificar Médico</h2>
            <form onSubmit={handleSubmit}>
                <input value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
                <input value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} />
                <input value={values.especialidad} onChange={(e) => setValues({ ...values, especialidad: e.target.value })} />
                <input value={values.matricula} onChange={(e) => setValues({ ...values, matricula: e.target.value })} />
                <button>Guardar</button>
            </form>
        </article>
    );
};
