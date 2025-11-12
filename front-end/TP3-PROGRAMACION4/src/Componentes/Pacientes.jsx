import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth.jsx";
import { Link } from "react-router-dom";

export const Pacientes = () => {
    const { fetchAuth } = useAuth();
    const [pacientes, setPacientes] = useState([]);

    const fetchPacientes = useCallback(async () => {
        const res = await fetchAuth("http://localhost:3000/pacientes");
        const data = await res.json();
        if (res.ok) setPacientes(data.pacientes || []);
    }, [fetchAuth]);

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    const handleEliminar = async (id) => {
        if (window.confirm("¿Desea eliminar el paciente?")) {
            await fetchAuth(`http://localhost:3000/pacientes/${id}`, { method: "DELETE" });
            fetchPacientes();
        }
    };

    return (
        <article>
            <h2>Listado de Pacientes</h2>
            <Link className="boton" to="/pacientes/crear">Nuevo Paciente</Link>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((p) => (
                        <tr key={p.id_paciente}>
                            <td>{p.id_paciente}</td>
                            <td>{p.nombre}</td>
                            <td>{p.apellido}</td>
                            <td>{p.dni}</td>
                            <td>
                                <div className="acciones">
                                    <Link className="boton" to={`/pacientes/${p.id_paciente}`}>Ver Detalles</Link>
                                    <Link className="boton" to={`/pacientes/${p.id_paciente}/modificar`}>Editar</Link>
                                    <button className="eliminar" onClick={() => handleEliminar(p.id_paciente)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
};
