import { useEffect, useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useParams } from "react-router-dom";

export const DetallesMedico = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const [medico, setMedico] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            const res = await fetchAuth(`http://localhost:3000/medicos/${id}`);
            const data = await res.json();
            setMedico(data.medico);
        };
        cargar();
    }, [fetchAuth, id]);

    if (!medico) return null;

    return (
        <article>
            <h2>Detalles del Médico</h2>
            <p><b>Nombre:</b> {medico.nombre}</p>
            <p><b>Apellido:</b> {medico.apellido}</p>
            <p><b>Especialidad:</b> {medico.especialidad}</p>
            <p><b>Matrícula:</b> {medico.matricula}</p>
        </article>
    );
};
