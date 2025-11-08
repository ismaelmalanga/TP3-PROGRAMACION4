import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth.jsx";
import { Link } from "react-router-dom";

export const Medicos = () => {
    const { fetchAuth } = useAuth();
    const [medicos, setMedicos] = useState([]);

    const fetchMedicos = useCallback(async () => {
        const res = await fetchAuth("http://localhost:3000/medicos");
        const data = await res.json();
        if (res.ok) setMedicos(data.medicos || []);
    }, [fetchAuth]);

    useEffect(() => {
        fetchMedicos();
    }, [fetchMedicos]);

    const handleEliminar = async (id) => {
        if (window.confirm("¿Desea eliminar el médico?")) {
            await fetchAuth(`http://localhost:3000/medicos/${id}`, { method: "DELETE" });
            fetchMedicos();
        }
    };

    return (
        <article>
            <h2>Médicos</h2>
            <Link to="/medicos/crear" role="button">Nuevo Médico</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicos.map((m) => (
                        <tr key={m.id_medico}>
                            <td>{m.id_medico}</td>
                            <td>{m.nombre}</td>
                            <td>{m.apellido}</td>
                            <td>{m.especialidad}</td>
                            <td>
                                <Link to={`/medicos/${m.id_medico}`}>Ver</Link>{" "}
                                <Link to={`/medicos/${m.id_medico}/modificar`}>Editar</Link>{" "}
                                <button onClick={() => handleEliminar(m.id_medico)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
};
