const express = require("express");
const router = express.Router();
const Usuario = require('./login');
const Pregunta = require('./Pregunta');

router.use((req, res, next) => {
    console.log(`--- Petición recibida: ${req.method} ${req.url} ---`);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    next();
});

//Endpoint del LOGIN
router.post("/api/login", async (request,response) => {
    const { username, password } = request.body;
    try {
        if (!username || !password) {
            return response.status(400).json({ error: "Faltan datos" });
        }
        const user = await Usuario.findOne({ where: { username: username, password: password } });
        if (user) {
            console.log("¡Validación exitosa!");
            response.json({ status: "yes", tipo: user.tipousuario });
        } else {
            console.log("Credenciales incorrectas");
            response.json({ status: "no" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        response.status(500).json({ status: "error", message: "Error en el servidor" });
    }  
});

//Endpoint para ver un ejercicio
router.get("/Pregunta", async (request,response) => {
    const id = request.query.id;
    if (!id || id === 'undefined' || id === 'null') {
        return response.status(400).json({ error: "ID no válido" });
    }
    try{
        const pregunta = await Pregunta.findByPk(id);
        response.json(pregunta ? [pregunta] : []);
    } catch (error){
        console.error("Error al obtener preguntas:", error);
        response.status(500).json({status: "no", error: error.message})
    }
});

//Endpoint para ver la lista de ejercicios
router.get("/Preguntas", async (request, response) => {
    try{
        const preguntas = await Pregunta.findAll({
            attributes: ['idEjercicio', 'pregunta', 'respuesta', 'tipo']
        });
        response.json(preguntas);
    } catch (error){
        console.error("Error al obtener preguntas:", error);
        response.status(500).json({status: "no", error: error.message})
    }
});

//Endpoint para crear un ejercicio
router.post("/Pregunta", async (request, response) => {
    console.log("METODO POST (CREAR):", request.body);
    try {
        await Pregunta.create(request.body);
        response.json({ status: "ok" });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.put("/Pregunta", async (request, response) => {
    const id = request.query.id;
    if (!id) {
        return response.status(400).json({ error: "ID no enviado desde el frontend" });
    }
    try {
        const resultado = await Pregunta.update(request.body, { 
            where: { idEjercicio: id } 
        });
        
        if (resultado[0] > 0) {
            response.json({ status: "ok" });
        } else {
            response.status(404).json({ error: "No se encontró el registro" });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.delete("/Pregunta", async (request, response) => {
    let id = request.query.id;
    
    if (id === 'undefined' || !id) {
        return response.status(400).json({ status: "error", message: "ID no proporcionado o inválido" });
    }

    try {
        const idNumerico = parseInt(id);
        
        const resultado = await Pregunta.destroy({ 
            where: { idEjercicio: idNumerico } 
        });
        
        response.json({ status: "ok", eliminados: resultado });
    } catch (error) {
        console.error("Error al eliminar:", error);
        response.status(500).json({ error: error.message });
    }
});

router.post("/pedirAyuda", async (request, response) => {
    const {codigo, pregunta} = request.body;
    const respuesta = await aiService.procesarAyuda(codigo, pregunta);
    response.json({ respuesta });
});

router.get("/snippets", (request, response) => {
    response.json(ejerciciosSaludMental);
});

module.exports = router;