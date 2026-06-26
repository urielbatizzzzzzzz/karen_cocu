import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pregunta = ({ idEjercicio, pregunta }) => {
    // Si la pregunta viene vacía, usamos un texto por defecto con su ID
    let textoPregunta = pregunta ? pregunta : "Pregunta #" + idEjercicio;

    return (
        <tr>
            {/* CORREGIDO: Usamos textoPregunta para asegurar que nunca se vea vacío */}
            <td className="align-middle">{textoPregunta}</td>
            <td>
                <div className="crud-acciones">
                    <Button variant="outline-success" size="sm" className="crud-btn">
                        <Link to={`/info?id=${idEjercicio}`} className="CrudLink" >
                            👁 Ver
                        </Link>
                    </Button>
                    <Button variant="outline-warning" size="sm" className="crud-btn">
                        <Link to={`/editar?id=${idEjercicio}`} className="CrudLink" >
                            ✏ Editar
                        </Link>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="crud-btn">
                        <Link to={`/eliminar?id=${idEjercicio}`} className="CrudLink" >
                            🗑 Eliminar
                        </Link>
                    </Button>
                </div>
            </td>
        </tr>
    );
}
export default Pregunta;