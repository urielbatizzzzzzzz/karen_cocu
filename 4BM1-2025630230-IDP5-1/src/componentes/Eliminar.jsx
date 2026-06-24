import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EliminarPregunta = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Extraemos el ID de la URL (?id=...)
        const params = new URLSearchParams(location.search);
        const qId = params.get("id");

        if (!qId || qId === "undefined" || qId === "null") {
            Swal.fire("Error", "ID de pregunta no válido.", "error");
            navigate("/administrator");
            return;
        }

        // 2. Confirmación visual antes de borrar definitivamente
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // 3. Disparamos la petición DELETE hacia el servidor
                axios.delete(`/Pregunta?id=${qId}`)
                    .then(response => {
                        if (response.data.status === "yes") {
                            Swal.fire("¡Eliminado!", "La pregunta ha sido borrada.", "success");
                        } else {
                            Swal.fire("Error", "No se pudo eliminar la pregunta.", "error");
                        }
                        navigate("/administrator"); // Regresamos a la tabla
                    })
                    .catch(err => {
                        console.error("Error al eliminar:", err);
                        Swal.fire("Error", "Hubo un problema con el servidor.", "error");
                        navigate("/administrator");
                    });
            } else {
                // Si el usuario cancela, lo regresamos a la tabla sin borrar nada
                navigate("/administrator");
            }
        });
    }, [location, navigate]);

    return (
        <div className="container mt-5 text-center">
            <h3>Procesando solicitud de eliminación...</h3>
        </div>
    );
};

export default EliminarPregunta;
