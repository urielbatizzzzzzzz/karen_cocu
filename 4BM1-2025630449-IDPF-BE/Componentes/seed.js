// ============================================================
// SIEMBRA AUTOMÁTICA DE DATOS INICIALES
// ============================================================
// Inserta los datos base SOLO si la tabla correspondiente está
// vacía (BD "virgen"). Es idempotente: al reiniciar el servidor
// no duplica nada porque primero comprueba el count() de cada tabla.
//
//   login     -> admin/1234 (administrador) y usuario/4321 (usuario)
//   tablajson -> los 5 ejercicios de salud mental de SerenaMente
//
// Se invoca desde Application.js después de sequelize.sync().
// ============================================================
const Usuario = require('./login');
const Pregunta = require('./Pregunta');

// Usuarios base de la aplicación.
const USUARIOS_INICIALES = [
    { username: 'admin', password: '1234', tipousuario: 'administrador' },
    { username: 'usuario', password: '4321', tipousuario: 'usuario' }
];

// Imágenes representativas tomadas de un CDN estable (Twemoji vía
// jsDelivr, versión fijada) para que no se rompan como pasaba con el
// antiguo via.placeholder.com. `tw(codigo)` arma la URL del ícono PNG.
const tw = (codigo) =>
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/${codigo}.png`;

const IMG = {
    ansiedad:     tw("1f630"), // 😰 cara con sudor frío
    depresion:    tw("1f614"), // 😔 cara abatida
    tiempoEspera: tw("23f3"),  // ⏳ reloj de arena
    oro:          tw("1f947"), // 🥇 mayor peso
    plata:        tw("1f948"), // 🥈 peso medio
    bronce:       tw("1f949"), // 🥉 menor peso
    termometro:   tw("1f321"), // 🌡️ puntaje / medición
    verde:        tw("1f7e2"), // 🟢 nivel bajo
    amarillo:     tw("1f7e1"), // 🟡 nivel medio
    rojo:         tw("1f534"), // 🔴 nivel alto
    agotado:      tw("1f62b"), // 😫 estrés alto
    tranquilo:    tw("1f642"), // 🙂 estrés bajo
    fuego:        tw("1f525"), // 🔥 riesgo / burnout
    ok:           tw("2705"),  // ✅ sin riesgo
    mareado:      tw("1f635"), // 😵 noche agitada
    durmiendo:    tw("1f634"), // 😴 buen descanso
    luna:         tw("1f319")  // 🌙 insomnio / noche
};

// Banco de preguntas inicial. Cada objeto se guarda tal cual en la
// columna JSON `columnajson` y respeta la forma que consume la app
// ({ titulo, pregunta, respuesta, drags[], targets[] }) ademas de los
// parametros del ejercicio de codigo (funcion, formula, entrada, etc.).
const PREGUNTAS_INICIALES = [
    {
        titulo: "Priorizacion de pacientes",
        pregunta: "Priorizacion de pacientes: relaciona cada factor clinico con el peso que aporta al puntaje de riesgo emocional.",
        respuesta: "ansiedad*0.5 + depresion*0.3 + tiempoEspera*0.2",
        drags: [
            { imagen: IMG.ansiedad, valor: "Ansiedad" },
            { imagen: IMG.depresion, valor: "Depresion" },
            { imagen: IMG.tiempoEspera, valor: "Tiempo de espera" }
        ],
        targets: [
            { imagen: IMG.oro, valor: "Peso 0.5" },
            { imagen: IMG.plata, valor: "Peso 0.3" },
            { imagen: IMG.bronce, valor: "Peso 0.2" }
        ],
        descripcion: "Calcular el nivel de riesgo emocional para priorizar la atencion del paciente.",
        funcion: "costoPaciente",
        formula: "ansiedad*0.5 + depresion*0.3 + tiempoEspera*0.2",
        entrada: [10, 20, 30],
        esperado: 17,
        codigo: "function costoPaciente(ansiedad, depresion, tiempoEspera){\n\n}"
    },
    {
        titulo: "Clasificacion de ansiedad",
        pregunta: "Clasificacion de ansiedad: relaciona cada puntaje con su categoria correspondiente.",
        respuesta: "puntaje < 30 = Baja, < 70 = Media, >= 70 = Alta",
        drags: [
            { imagen: IMG.termometro, valor: "Puntaje 25" },
            { imagen: IMG.termometro, valor: "Puntaje 55" },
            { imagen: IMG.termometro, valor: "Puntaje 85" }
        ],
        targets: [
            { imagen: IMG.verde, valor: "Baja" },
            { imagen: IMG.amarillo, valor: "Media" },
            { imagen: IMG.rojo, valor: "Alta" }
        ],
        descripcion: "Determinar si la ansiedad es baja, media o alta segun el puntaje.",
        funcion: "clasificarAnsiedad",
        formula: "puntaje < 30 = Baja, < 70 = Media, >= 70 = Alta",
        entrada: [50],
        esperado: "Media",
        codigo: "function clasificarAnsiedad(puntaje){\n\n}"
    },
    {
        titulo: "Estres laboral",
        pregunta: "Estres laboral: relaciona cada escenario de trabajo con su resultado de riesgo de burnout.",
        respuesta: "estres > 80 && horasExtra > 20  =>  true",
        drags: [
            { imagen: IMG.agotado, valor: "Estres 90 / Horas extra 25" },
            { imagen: IMG.tranquilo, valor: "Estres 50 / Horas extra 10" }
        ],
        targets: [
            { imagen: IMG.fuego, valor: "Riesgo de burnout: true" },
            { imagen: IMG.ok, valor: "Sin riesgo: false" }
        ],
        descripcion: "Determinar si existe riesgo de burnout segun el estres y las horas extra.",
        funcion: "evaluarBurnout",
        formula: "estres > 80 && horasExtra > 20",
        entrada: [90, 25],
        esperado: true,
        codigo: "function evaluarBurnout(estres, horasExtra){\n\n}"
    },
    {
        titulo: "Riesgo de insomnio",
        pregunta: "Riesgo de insomnio: relaciona cada combinacion de habitos nocturnos con su resultado de riesgo.",
        respuesta: "(pantalla > 3 && cafeina > 2) || estres > 70  =>  true",
        drags: [
            { imagen: IMG.mareado, valor: "Pantalla 4h / Cafeina 3 / Estres 75" },
            { imagen: IMG.durmiendo, valor: "Pantalla 1h / Cafeina 0 / Estres 20" }
        ],
        targets: [
            { imagen: IMG.luna, valor: "Insomnio: true" },
            { imagen: IMG.ok, valor: "Insomnio: false" }
        ],
        descripcion: "Determinar si hay riesgo de insomnio segun pantalla, cafeina y estres.",
        funcion: "evaluarInsomnio",
        formula: "pantalla > 3 && cafeina > 2 || estres > 70",
        entrada: [4, 3, 75],
        esperado: true,
        codigo: "function evaluarInsomnio(pantalla, cafeina, estres){\n\n}"
    },
    {
        titulo: "Nivel de ansiedad general",
        pregunta: "Nivel de ansiedad general: ubica cada puntaje del paciente en el nivel correcto.",
        respuesta: "0-30 Baja, 31-60 Media, 61-100 Alta",
        drags: [
            { imagen: IMG.termometro, valor: "Puntaje 20" },
            { imagen: IMG.termometro, valor: "Puntaje 45" },
            { imagen: IMG.termometro, valor: "Puntaje 65" }
        ],
        targets: [
            { imagen: IMG.verde, valor: "Baja" },
            { imagen: IMG.amarillo, valor: "Media" },
            { imagen: IMG.rojo, valor: "Alta" }
        ],
        descripcion: "Clasifica el nivel de ansiedad general del paciente segun el puntaje.",
        funcion: "nivelAnsiedad",
        formula: "0-30 Baja, 31-60 Media, 61-100 Alta",
        entrada: [65],
        esperado: "Alta",
        codigo: "function nivelAnsiedad(puntaje){\n\n}"
    }
];

// Siembra cada tabla solo si está vacía. Devuelve un resumen.
async function sembrarSiVacio() {
    const resumen = { usuarios: 0, preguntas: 0 };

    const totalUsuarios = await Usuario.count();
    if (totalUsuarios === 0) {
        await Usuario.bulkCreate(USUARIOS_INICIALES);
        resumen.usuarios = USUARIOS_INICIALES.length;
        console.log(`Siembra: ${resumen.usuarios} usuarios iniciales creados.`);
    }

    const totalPreguntas = await Pregunta.count();
    if (totalPreguntas === 0) {
        await Pregunta.bulkCreate(
            PREGUNTAS_INICIALES.map((p) => ({ columnajson: p }))
        );
        resumen.preguntas = PREGUNTAS_INICIALES.length;
        console.log(`Siembra: ${resumen.preguntas} preguntas iniciales creadas.`);
    }

    if (resumen.usuarios === 0 && resumen.preguntas === 0) {
        console.log("Siembra: la BD ya tenia datos, no se inserto nada.");
    }
    return resumen;
}

module.exports = { sembrarSiVacio };
