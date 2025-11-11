import { useEffect, useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useParams } from "react-router-dom";

export const DetallesPaciente = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const [paciente, setPaciente] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            const res = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
            const data = await res.json();
            setPaciente(data.paciente);
        };
        cargar();
    }, [fetchAuth, id]);

    if (!paciente) return null;

    const fechaFormateada = new Date(paciente.fecha_nacimiento).toLocaleDateString("es-AR", {day: "2-digit",month: "2-digit",year: "numeric",
    });

    return (
        <article>
            <h2>Detalles del Paciente</h2>
            <p><b>Nombre:</b> {paciente.nombre}</p>
            <p><b>Apellido:</b> {paciente.apellido}</p>
            <p><b>DNI:</b> {paciente.dni}</p>
            <p><b>Fecha de Nacimiento:</b> {fechaFormateada}</p>
            <p><b>Obra Social:</b> {paciente.obra_social}</p>
        </article>
    );
};
