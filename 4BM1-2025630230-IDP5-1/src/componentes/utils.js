// ============================================================
// UTILIDADES COMPARTIDAS
// ============================================================

// La columna `columnajson` es de tipo JSON en MySQL. Sequelize/mysql2
// la devuelven YA convertida en objeto JavaScript, por lo que llamar a
// JSON.parse() sobre ella lanzaba una excepción y la pregunta se veía
// vacía. Esta función acepta tanto objetos como cadenas y nunca rompe.
export function parseColumnaJson(valor) {
    if (!valor) return {};
    if (typeof valor === "object") return valor;
    try {
        return JSON.parse(valor);
    } catch (e) {
        console.error("No se pudo interpretar columnajson:", e);
        return {};
    }
}

// Resuelve la ruta de una imagen. Si ya es una URL absoluta (http/https)
// se usa tal cual; si es una ruta relativa se le antepone el backend.
export function resolverImagen(ruta) {
    if (!ruta) return "";
    if (/^https?:\/\//i.test(ruta)) return ruta;
    return `http://localhost:8080${ruta}`;
}
