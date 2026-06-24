import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pregunta = ({ idEjercicio, pregunta }) => {
    // Si la pregunta viene vacía, usamos un texto por defecto con su ID
    let textoPregunta = pregunta ? pregunta : "Pregunta #" + idEjercicio;

    return (
        <tr>
            {/* CORREGIDO: Usamos textoPregunta para asegurar que nunca se vea vacío */}
            <td>{textoPregunta}</td>
            <td className="AlignCenter">
                <Button variant="success" className="M-6">
                    <Link to={`/info?id=${idEjercicio}`} className="CustomLink" >
                        Ver pregunta
                    </Link>
                </Button>
                <Button variant="warning" className="M-6">
                    <Link to={`/editar?id=${idEjercicio}`} className="CustomLink" >
                        Editar pregunta
                    </Link>
                </Button>
                <Button variant="danger" className="M-6">
                    <Link to={`/eliminar?id=${idEjercicio}`} className="CustomLink" >
                        Eliminar pregunta
                    </Link>                    
                </Button>
            </td>
        </tr>
    );
}
export default Pregunta;