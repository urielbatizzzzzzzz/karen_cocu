const express = require("express");
const router = express.Router();
const Usuario = require('./login');
const Pregunta = require('./Pregunta');
const aiService = require('./aiService');
const { ejerciciosSaludMental } = require('./snippets');

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
            attributes: ['idEjercicio', 'columnajson']
        });
        response.json(preguntas);
    } catch (error){
        console.error("Error al obtener preguntas:", error);
        response.status(500).json({status: "no", error: error.message})
    }
});

// Empaqueta los campos planos del formulario en el objeto JSON
// que se almacena en la columna `columnajson` de la tabla.
function construirColumnaJson(body) {
    return {
        pregunta: body.pregunta || "",
        respuesta: body.respuesta || "",
        drags: body.drags || [],
        targets: body.targets || []
    };
}

//Endpoint para crear/actualizar un ejercicio
router.post("/Pregunta", async (request, response) => {
    console.log("METODO POST (CREAR/ACTUALIZAR):", request.body);
    try {
        const columnajson = construirColumnaJson(request.body);
        const id = request.body.idEjercicio;

        // Si llega un id válido se actualiza; en caso contrario se crea.
        if (id && id !== 'undefined' && id !== 'null' && id !== "") {
            const resultado = await Pregunta.update(
                { columnajson },
                { where: { idEjercicio: parseInt(id) } }
            );
            if (resultado[0] > 0) {
                return response.json({ status: "yes", message: "Pregunta actualizada correctamente." });
            }
            return response.status(404).json({ status: "no", error: "No se encontró el registro a actualizar" });
        }

        const creada = await Pregunta.create({ columnajson });
        response.json({ status: "yes", message: "Pregunta creada correctamente.", idEjercicio: creada.idEjercicio });
    } catch (error) {
        console.error("Error al crear/actualizar:", error);
        response.status(500).json({ status: "no", error: error.message });
    }
});

//Endpoint para actualizar un ejercicio (edición explícita por id en query)
router.put("/Pregunta", async (request, response) => {
    const id = request.query.id;
    if (!id || id === 'undefined' || id === 'null') {
        return response.status(400).json({ status: "no", error: "ID no enviado desde el frontend" });
    }
    try {
        const columnajson = construirColumnaJson(request.body);
        const resultado = await Pregunta.update(
            { columnajson },
            { where: { idEjercicio: parseInt(id) } }
        );

        if (resultado[0] > 0) {
            response.json({ status: "yes", message: "Pregunta actualizada correctamente." });
        } else {
            response.status(404).json({ status: "no", error: "No se encontró el registro" });
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        response.status(500).json({ status: "no", error: error.message });
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

        // El frontend (Eliminar.jsx) espera status === "yes" para confirmar.
        if (resultado > 0) {
            return response.json({ status: "yes", eliminados: resultado });
        }
        response.status(404).json({ status: "no", error: "No se encontró la pregunta a eliminar" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        response.status(500).json({ error: error.message });
    }
});

router.post("/pedirAyuda", async (request, response) => {
    const {codigo, pregunta} = request.body;
    const respuesta = await aiService.procesarAyuda(codigo, pregunta, "ayuda");
    response.json({ respuesta });
});

//Endpoint de ayuda IA (consumido por ProbarEjercicio.jsx) -> pista breve
router.post("/api/ia", async (request, response) => {
    const { codigo, funcion, entrada } = request.body;
    try {
        const contexto = `Función objetivo: ${funcion}. Entrada de prueba: ${JSON.stringify(entrada)}`;
        const respuesta = await aiService.procesarAyuda(codigo, contexto, "ayuda");
        response.json({ respuesta });
    } catch (error) {
        console.error("Error en /api/ia:", error);
        response.status(500).json({ respuesta: "Error IA", error: error.message });
    }
});

//Endpoint del Tutor IA (consumido por ProbarEjercicio.jsx) -> análisis profundo
router.post("/api/ia-tutor", async (request, response) => {
    const { codigo, contexto } = request.body;
    try {
        const respuesta = await aiService.procesarAyuda(codigo, JSON.stringify(contexto), "tutor");
        response.json({ respuesta });
    } catch (error) {
        console.error("Error en /api/ia-tutor:", error);
        response.status(500).json({ respuesta: "Error Tutor IA", error: error.message });
    }
});

router.get("/snippets", (request, response) => {
    response.json(ejerciciosSaludMental);
});

module.exports = router;