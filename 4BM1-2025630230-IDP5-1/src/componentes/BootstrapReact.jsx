// ============================================================
// COMPONENTE: BootstrapReact.jsx (App.jsx)
// ============================================================
// DESCRIPCIÓN: Componente principal que define las rutas de la aplicación
// FUNCIONALIDAD: Configura el enrutamiento usando React Router DOM
// ============================================================

// Importaciones de React y dependencias
import React from "react";
import { Routes, Route } from 'react-router-dom';  // Sistema de enrutamiento
import 'bootstrap/dist/css/bootstrap.min.css';     // Estilos de Bootstrap

// ============================================================
// IMPORTACIÓN DE COMPONENTES
// ============================================================
// Cada componente representa una página o vista de la aplicación
// ============================================================
import Login from "./Login.jsx";                 // Página de autenticación
import Administrator from "./Administrator.jsx"; // Panel de administración
import Info from "./Info.jsx";                   // Detalles de pregunta
import Formulario from "./Formulario.jsx";       // Crear/Editar pregunta
import Eliminar from "./Eliminar.jsx";           // Confirmar eliminación
import UsuarioNoValido from "./UsuarioNoValido.jsx"; // Acceso denegado
import ProbarEjercicio from "./ProbarEjercicio.jsx"; // Editor de código

// ============================================================
// ESTILOS PERSONALIZADOS
// ============================================================
import '../css/estilos.css';  // Hoja de estilos propia del proyecto

// ============================================================
// CLASE PRINCIPAL: BootstrapReact
// ============================================================
// Componente contenedor que define todas las rutas de la aplicación
// Utiliza React Router DOM para la navegación entre páginas
// ============================================================
class BootstrapReact extends React.Component {
    
    // ============================================================
    // MÉTODO: render
    // ============================================================
    // Renderiza el contenedor con todas las rutas definidas
    // Cada Route asocia una URL con un componente
    // ============================================================
    render() {
        return (
            <div>
                {/* ============================================================
                    SISTEMA DE RUTAS
                ============================================================
                    Routes: Contenedor de todas las rutas
                    Route: Define una ruta con path y element
                ============================================================ */}
                <Routes>

                    {/* ============================================================
                        RUTA: LOGIN (Página de inicio)
                    ============================================================
                        URL: "/"
                        Componente: Login
                        Página de autenticación de usuarios
                    ============================================================ */}
                    <Route
                        path="/"
                        element={<Login />}
                    />

                    {/* ============================================================
                        RUTA: ADMINISTRADOR (Panel principal)
                    ============================================================
                        URL: "/administrator"
                        Componente: Administrator
                        Muestra listado de preguntas y acceso a CRUD
                        Solo accesible para usuarios autenticados
                    ============================================================ */}
                    <Route
                        path="/administrator"
                        element={<Administrator />}
                    />

                    {/* ============================================================
                        RUTA: INFORMACIÓN (Detalles de pregunta)
                    ============================================================
                        URL: "/info?id={id}"
                        Componente: Info
                        Muestra detalles completos de una pregunta
                        Incluye drags y targets con imágenes
                    ============================================================ */}
                    <Route
                        path="/info"
                        element={<Info />}
                    />

                    {/* ============================================================
                        RUTA: FORMULARIO (Crear nueva pregunta)
                    ============================================================
                        URL: "/formulario"
                        Componente: Formulario
                        Modo creación: campos vacíos para nueva pregunta
                    ============================================================ */}
                    <Route
                        path="/formulario"
                        element={<Formulario />}
                    />

                    {/* ============================================================
                        RUTA: EDITAR (Modificar pregunta existente)
                    ============================================================
                        URL: "/editar?id={id}"
                        Componente: Formulario (Modo edición)
                        Carga los datos de la pregunta y permite modificarlos
                    ============================================================ */}
                    <Route
                        path="/editar"
                        element={<Formulario />}
                    />

                    {/* ============================================================
                        RUTA: ELIMINAR (Confirmación de eliminación)
                    ============================================================
                        URL: "/eliminar?id={id}"
                        Componente: Eliminar
                        Muestra confirmación antes de eliminar
                        Ejecuta DELETE en el backend
                    ============================================================ */}
                    <Route
                        path="/eliminar"
                        element={<Eliminar />}
                    />

                    {/* ============================================================
                        RUTA: USUARIO NO VÁLIDO (Acceso denegado)
                    ============================================================
                        URL: "/no-valido"
                        Componente: UsuarioNoValido
                        Mensaje de error cuando las credenciales son incorrectas
                    ============================================================ */}
                    <Route
                        path="/no-valido"
                        element={<UsuarioNoValido />}
                    />

                    {/* ============================================================
                        RUTA: PROBAR EJERCICIO (Editor de código)
                    ============================================================
                        URL: "/probar?id={id}"
                        Componente: ProbarEjercicio
                        Editor Monaco para escribir y ejecutar código JavaScript
                        Incluye Ghost Text y IA Tutor
                    ============================================================ */}
                    <Route
                        path="/probar"
                        element={<ProbarEjercicio />}
                    />

                </Routes>
            </div>
        );
    }
}

// ============================================================
// EXPORTACIÓN DEL COMPONENTE
// ============================================================
export default BootstrapReact;