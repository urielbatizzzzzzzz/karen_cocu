// ============================================================
// COMPONENTE: UsuarioNoValido.jsx
// ============================================================
// DESCRIPCIÓN: Página de error para acceso denegado
// FUNCIONALIDAD: Muestra un mensaje cuando las credenciales son incorrectas
// ============================================================

// Importaciones de React y dependencias
import React from "react";
import { Link } from "react-router-dom";  // Para navegación
import 'bootstrap/dist/css/bootstrap.min.css';  // Estilos de Bootstrap

// ============================================================
// COMPONENTE FUNCIONAL: UsuarioNoValido
// ============================================================
// Componente sin estado (stateless)
// Renderiza una página amigable de error de autenticación
// ============================================================
function UsuarioNoValido() {
    return (
        // ============================================================
        // CONTENEDOR PRINCIPAL
        // ============================================================
        // no-valido-container: Fondo con estilos personalizados
        // ============================================================
        <div className="no-valido-container">
            
            {/* ============================================================
                TARJETA DE ACCESO DENEGADO
            ============================================================
                no-valido-card: Tarjeta centrada con sombra y bordes
                Muestra el mensaje de error y un botón para regresar
            ============================================================ */}
            <div className="no-valido-card">

                {/* ============================================================
                    TÍTULO PRINCIPAL
                ============================================================
                    no-valido-title: Estilo para el nombre del sistema
                ============================================================ */}
                <h1 className="no-valido-title">
                    SerenaMente
                </h1>

                {/* ============================================================
                    SUBTÍTULO DE ERROR
                ============================================================
                    no-valido-subtitle: Mensaje de acceso no autorizado
                ============================================================ */}
                <h3 className="no-valido-subtitle">
                    Acceso no autorizado
                </h3>

                {/* ============================================================
                    MENSAJE DESCRIPTIVO
                ============================================================
                    no-valido-text: Explicación del error y sugerencia
                    Indica al usuario que sus credenciales son incorrectas
                ============================================================ */}
                <p className="no-valido-text">
                    No se encontró una cuenta válida con las credenciales ingresadas.
                    <br />
                    Por favor verifica tu usuario y contraseña antes de continuar.
                </p>

                {/* ============================================================
                    BOTÓN: VOLVER AL LOGIN
                ============================================================
                    Redirige al usuario a la página de inicio de sesión
                    no-valido-btn: Botón personalizado con estilos
                ============================================================ */}
                <Link to="/" className="btn no-valido-btn text-white">
                    Volver al Login
                </Link>

            </div>
        </div>
    );
}

// ============================================================
// EXPORTACIÓN DEL COMPONENTE
// ============================================================
export default UsuarioNoValido;