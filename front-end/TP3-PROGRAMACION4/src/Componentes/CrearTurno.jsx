import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export const CrearTurno = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        fecha: "",
        hora: "",
        estado: "pendiente",
        observaciones: "",
        id_paciente: "",
        id_medico: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchAuth("http://localhost:3000/turnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            return alert("Error al crear turno");
        }
        navigate("/turnos");
    };

    return (
        <article>
            <h2>Crear turno</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        Fecha
                        <input
                            type="date"
                            value={values.fecha}
                            onChange={(e) => setValues({ ...values, fecha: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Hora
                        <input
                            type="time"
                            value={values.hora}
                            onChange={(e) => setValues({ ...values, hora: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        ID Paciente
                        <input
                            type="number"
                            value={values.id_paciente}
                            onChange={(e) => setValues({ ...values, id_paciente: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        ID Médico
                        <input
                            type="number"
                            value={values.id_medico}
                            onChange={(e) => setValues({ ...values, id_medico: e.target.value })}
                            required
                        />
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
                <input type="submit" value="Guardar turno" />
            </form>
        </article>
    );
};
