const express = require("express");
const app = express();
const puerto = 8080;
const url = require("url");
const mysql = require("mysql");
const sequelize = require("./Componentes/sequelize");
const router = require("./Componentes/rutas");

app.use(express.static('public'));
app.use(express.json());
app.use('/', router);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

sequelize.sync().then(() => {
    try{
        console.log("Base de Datos sincronizada.");
        app.listen(puerto, () => {
            console.log("Servidor corriendo en el puerto: " + puerto);
        });
    } catch(error){
        console.error("Error al sincronizar:", err);
    }  
});
