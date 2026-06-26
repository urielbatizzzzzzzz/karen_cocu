// ============================================================
// SERVICIO DE IA - OpenRouter (OpenAI compatible)
// ============================================================
// Migrado de Gemini a OpenRouter. OpenRouter expone una API
// compatible con OpenAI, por lo que basta una petición HTTP a
// /chat/completions con la API key en la cabecera Authorization.
//
// Variables de entorno requeridas (.env):
//   OPENROUTER_API_KEY  -> tu llave de https://openrouter.ai/keys
//   OPENROUTER_MODEL    -> (opcional) modelo a usar
// ============================================================
require('dotenv').config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELO = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

// Construye el prompt segun el modo solicitado.
//   modo = "ayuda" -> una PISTA breve, sin dar la solucion completa.
//   modo = "tutor" -> analisis profundo del codigo paso a paso.
function construirMensajes(codigoUsuario, preguntaContexto, modo) {
    const sistema = `Eres SerenaMente, un tutor experto en JavaScript (ES6) enfocado en ` +
        `ejercicios de salud mental. Respondes en español, claro y con bloques de codigo ` +
        `usando markdown cuando ayude.`;

    let usuario;
    if (modo === "tutor") {
        usuario =
`Actua como TUTOR. Analiza el codigo del estudiante a profundidad.
Contexto del ejercicio: ${preguntaContexto}
Codigo actual del estudiante:
\`\`\`javascript
${codigoUsuario}
\`\`\`
Explica: 1) que hace el codigo, 2) errores o riesgos, 3) como mejorarlo paso a paso.
Si esta vacio, guia al estudiante sobre como empezar. No reveles toda la solucion de golpe.`;
    } else {
        usuario =
`Actua como AYUDANTE. Da UNA pista util y corta (no la solucion completa).
Contexto del ejercicio: ${preguntaContexto}
Codigo actual del estudiante:
\`\`\`javascript
${codigoUsuario}
\`\`\`
Devuelve la pista mas importante para avanzar, en pocas lineas.`;
    }

    return [
        { role: "system", content: sistema },
        { role: "user", content: usuario }
    ];
}

// Llama a OpenRouter y devuelve el texto de la respuesta.
// modo: "ayuda" (por defecto) | "tutor"
exports.procesarAyuda = async (codigoUsuario, preguntaContexto, modo = "ayuda") => {
    if (!process.env.OPENROUTER_API_KEY) {
        return "Falta configurar OPENROUTER_API_KEY en el archivo .env del backend.";
    }

    try {
        const respuesta = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // Cabeceras opcionales recomendadas por OpenRouter:
                "HTTP-Referer": "http://localhost:8080",
                "X-Title": "SerenaMente"
            },
            body: JSON.stringify({
                model: MODELO,
                messages: construirMensajes(codigoUsuario, preguntaContexto, modo),
                temperature: 0.4
            })
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            return `Error de OpenRouter (${respuesta.status}): ${detalle}`;
        }

        const data = await respuesta.json();
        return data?.choices?.[0]?.message?.content || "La IA no devolvio contenido.";
    } catch (error) {
        return "Error al conectar con la IA: " + error.message;
    }
};
