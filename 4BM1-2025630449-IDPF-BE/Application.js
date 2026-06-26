const express = require("express");
const app = express();
const puerto = 8080;
const path = require("path");
const url = require("url");
const mysql = require("mysql");
const sequelize = require("./Componentes/sequelize");
const router = require("./Componentes/rutas");
const { sembrarSiVacio } = require("./Componentes/seed");

// ============================================================
// CORS - permite que el frontend del dev-server (puerto 3000)
// consuma la API del backend (puerto 8080) sin ser bloqueado
// por el navegador. Sin dependencias externas.
// ============================================================
const ORIGENES_PERMITIDOS = ["http://localhost:3000", "http://localhost:8080"];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (ORIGENES_PERMITIDOS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Responder de inmediato a las peticiones de verificación (preflight)
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.static('public'));
app.use(express.json());
app.use('/', router);

// Fallback SPA: cualquier navegación (GET de HTML) que no haya coincidido
// con un archivo estático ni con una ruta del router (p.ej. /probar, /psico,
// /administrator al recargar) devuelve index.html para que React Router
// resuelva la vista del lado del cliente.
app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html")) {
        return res.sendFile(path.join(__dirname, "public", "index.html"));
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

sequelize.sync().then(async () => {
    try{
        console.log("Base de Datos sincronizada.");
        // Siembra datos iniciales SOLO si las tablas están vacías (BD virgen).
        await sembrarSiVacio();
        app.listen(puerto, () => {
            console.log("Servidor corriendo en el puerto: " + puerto);
        });
    } catch(error){
        console.error("Error al sincronizar o sembrar:", error);
    }
});
