// ============================================================
// SERVICIO DE IA - Groq (OpenAI compatible)
// ============================================================
// Groq expone una API compatible con OpenAI, por lo que basta una
// petición HTTP a /chat/completions con la API key en la cabecera
// Authorization. Su capa gratuita es estable y muy rápida.
//
// Variables de entorno requeridas (.env):
//   GROQ_API_KEY  -> tu llave de https://console.groq.com/keys
//   GROQ_MODEL    -> (opcional) modelo a usar
// ============================================================
require('dotenv').config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Modelo principal (configurable por .env) + modelos de respaldo.
// Si el principal está saturado (429) se prueba el siguiente automáticamente.
const MODELO_PRINCIPAL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const MODELOS = [...new Set([
    MODELO_PRINCIPAL,
    "llama-3.1-8b-instant",
    "openai/gpt-oss-20b"
])];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

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

// Llama a Groq y devuelve el texto de la respuesta.
// modo: "ayuda" (por defecto) | "tutor"
exports.procesarAyuda = async (codigoUsuario, preguntaContexto, modo = "ayuda") => {
    if (!process.env.GROQ_API_KEY) {
        return "Falta configurar GROQ_API_KEY en el archivo .env del backend (https://console.groq.com/keys).";
    }

    const mensajes = construirMensajes(codigoUsuario, preguntaContexto, modo);

    // Se recorren los modelos: ante un 429 (saturado) se reintenta una vez
    // tras una breve espera y, si persiste, se pasa al siguiente modelo.
    for (const modelo of MODELOS) {
        for (let intento = 0; intento < 2; intento++) {
            try {
                const respuesta = await fetch(GROQ_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ model: modelo, messages: mensajes, temperature: 0.4 })
                });

                if (respuesta.ok) {
                    const data = await respuesta.json();
                    return data?.choices?.[0]?.message?.content || "La IA no devolvio contenido.";
                }

                // 429 = saturado: esperamos el tiempo sugerido y reintentamos.
                if (respuesta.status === 429) {
                    const retry = parseInt(respuesta.headers.get("Retry-After")) || 3;
                    console.warn(`Modelo ${modelo} saturado (429). Reintento en ${retry}s...`);
                    if (intento === 0) {
                        await espera(Math.min(retry, 5) * 1000);
                        continue; // reintenta el mismo modelo
                    }
                    break; // ya se reintentó: probar siguiente modelo
                }

                // Otro error (401, 400, etc.): no tiene sentido reintentar.
                const detalle = await respuesta.text();
                console.error(`Error Groq (${respuesta.status}) con ${modelo}: ${detalle}`);
                break;
            } catch (error) {
                console.error(`Fallo de red con ${modelo}:`, error.message);
                break;
            }
        }
    }

    return "La IA está temporalmente saturada o la API key no es válida. " +
           "Espera unos segundos e inténtalo de nuevo, o revisa tu GROQ_API_KEY en el .env.";
};
