require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.procesarAyuda = async (codigoUsuario, preguntaContexto) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Ajustamos el prompt para que actúe como un desarrollador que genera ejercicios
        const prompt = `Actúa como un desarrollador experto en JavaScript 6 y gestión de salud mental. 
        El usuario quiere crear un nuevo ejercicio de tipo: ${preguntaContexto}.
        Código base actual: ${codigoUsuario}.
        
        REGLAS:
        1. Proporciona el código necesario (ej. lógica de drag-and-drop o validación de estado de ánimo).
        2. Mantén el código en estilo JavaScript 6 (ES6).
        3. Explica brevemente cómo integrar este bloque en el backend/frontend.
        4. No escribas todo el archivo, solo el bloque lógico solicitado.`;
        
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        return "Error al conectar con la IA: " + error.message;
    }
};