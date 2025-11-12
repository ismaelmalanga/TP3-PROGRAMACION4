import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth";

export const DetallesTurno = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const [turno, setTurno] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurno = async () => {
            try {
                const response = await fetchAuth(`http://localhost:3000/turnos/${id}`);
                const data = await response.json();
                if (!response.ok || !data.success) {
                    setError(data.message || "Error al obtener el turno");
                    return;
                }
                setTurno(data.turno);
            } catch {
                setError("No se pudo conectar con el servidor");
            }
        };
        fetchTurno();
    }, [fetchAuth, id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!turno) return <p>Cargando...</p>;

    const fechaFormateada = turno.fecha
        ? new Date(turno.fecha).toLocaleDateString("es-AR", {day: "2-digit",month: "2-digit",year: "numeric",})
        : "-";


    const horaFormateada = turno.hora ? turno.hora.slice(0, 5) : "-";

    return (
        <article>
            <h2>Detalles del turno</h2>
            <p><b>Paciente:</b> {turno.paciente}</p>
            <p><b>Médico:</b> {turno.medico}</p>
            <p><b>Fecha:</b> {fechaFormateada}</p>
            <p><b>Hora:</b> {horaFormateada}</p>
            <p><b>Estado:</b> {turno.estado}</p>
            <p><b>Observaciones:</b> {turno.observaciones || "Sin observaciones"}</p>
        </article>
    );
};
