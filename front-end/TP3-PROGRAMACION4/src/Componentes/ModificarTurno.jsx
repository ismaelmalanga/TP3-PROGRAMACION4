import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export const ModificarTurno = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const fetchTurno = async () => {
            const response = await fetchAuth(`http://localhost:3000/turnos/${id}`);
            const data = await response.json();
            if (response.ok && data.success) {
                setValues(data.turno);
            }
        };
        fetchTurno();
    }, [fetchAuth, id]);

    if (!values) return <p>Cargando...</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            return alert("Error al modificar turno");
        }
        navigate("/turnos");
    };

    return (
        <article>
            <h2>Modificar turno</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        Estado
                        <select
                            value={values.estado}
                            onChange={(e) => setValues({ ...values, estado: e.target.value })}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="atendido">Atendido</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </label>
                    <label>
                        Observaciones
                        <textarea
                            value={values.observaciones}
                            onChange={(e) =>
                                setValues({ ...values, observaciones: e.target.value })
                            }
                        />
                    </label>
                </fieldset>
                <input type="submit" value="Guardar cambios" />
            </form>
        </article>
    );
};
