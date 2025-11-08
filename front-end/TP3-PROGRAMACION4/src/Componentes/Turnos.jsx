import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export const Turnos = () => {
    const { fetchAuth } = useAuth();
    const [turnos, setTurnos] = useState([]);

    const fetchTurnos = useCallback(async () => {
        const response = await fetchAuth("http://localhost:3000/turnos");
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error("Error al cargar turnos:", data.message);
            return;
        }
        setTurnos(data.turnos);
    }, [fetchAuth]);

    useEffect(() => {
        fetchTurnos();
    }, [fetchTurnos]);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar este turno?")) return;
        const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (response.ok && data.success) {
            fetchTurnos();
        } else {
            window.alert("Error al eliminar turno");
        }
    };

    return (
        <article>
            <h2>Listado de turnos</h2>
            <Link role="button" to="/turnos/crear">Nuevo turno</Link>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map((t) => (
                        <tr key={t.id_turno}>
                            <td>{t.id_turno}</td>
                            <td>{t.paciente}</td>
                            <td>{t.medico}</td>
                            <td>{t.fecha}</td>
                            <td>{t.hora}</td>
                            <td>{t.estado}</td>
                            <td>{t.observaciones || "-"}</td>
                            <td>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <Link role="button" to={`/turnos/${t.id_turno}`}>Ver</Link>
                                    <Link role="button" to={`/turnos/${t.id_turno}/modificar`}>Editar</Link>
                                    <button onClick={() => handleEliminar(t.id_turno)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
};
