function evaluarAnsiedad(nivel) {
    if (nivel > 7) {
        return "Te recomiendo realizar la técnica de respiración 4-7-8.";
    } else {
        return "Tu nivel es bajo, ¡sigue practicando tu meditación diaria!";
    }
}

const ejerciciosSaludMental = [
    {
        id: 1,
        nombre: "Evaluador de Ansiedad",
        codigo: `function evaluarAnsiedad(nivel) { ... }`,
        descripcion: "Ayuda al usuario a medir su nivel de ansiedad."
    }
];

module.exports = { ejerciciosSaludMental };