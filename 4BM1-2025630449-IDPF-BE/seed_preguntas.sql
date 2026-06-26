-- ============================================================
-- SEED: Banco de preguntas de SerenaMente (salud mental)
-- ============================================================
-- Alternativa MANUAL al seeding automático de Componentes/seed.js
-- (que se ejecuta solo cuando la BD está vacía). Inserta en
-- crudjson.tablajson los 5 ejercicios de salud mental y, en login,
-- los usuarios admin y usuario.
--
-- Las imágenes usan un CDN estable (Twemoji vía jsDelivr, versión
-- fijada) en lugar del antiguo via.placeholder.com, que dejó de
-- estar disponible.
--
-- Uso:
--   mysql -u root -p crudjson < seed_preguntas.sql
-- ============================================================

USE crudjson;

-- Usuarios base (admin ya suele existir; INSERT IGNORE evita el error
-- de clave única si se vuelve a ejecutar).
INSERT IGNORE INTO login (username, password, tipousuario) VALUES
  ('admin', '1234', 'administrador'),
  ('usuario', '4321', 'usuario');

-- 1) Priorizacion de pacientes
INSERT INTO tablajson (columnajson) VALUES ('{
  "titulo": "Priorizacion de pacientes",
  "pregunta": "Priorizacion de pacientes: relaciona cada factor clinico con el peso que aporta al puntaje de riesgo emocional.",
  "respuesta": "ansiedad*0.5 + depresion*0.3 + tiempoEspera*0.2",
  "drags": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f630.png", "valor": "Ansiedad"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f614.png", "valor": "Depresion"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/23f3.png", "valor": "Tiempo de espera"}
  ],
  "targets": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f947.png", "valor": "Peso 0.5"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f948.png", "valor": "Peso 0.3"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f949.png", "valor": "Peso 0.2"}
  ],
  "descripcion": "Calcular el nivel de riesgo emocional para priorizar la atencion del paciente.",
  "funcion": "costoPaciente",
  "formula": "ansiedad*0.5 + depresion*0.3 + tiempoEspera*0.2",
  "entrada": [10, 20, 30],
  "esperado": 17,
  "codigo": "function costoPaciente(ansiedad, depresion, tiempoEspera){\\n\\n}"
}');

-- 2) Clasificacion de ansiedad
INSERT INTO tablajson (columnajson) VALUES ('{
  "titulo": "Clasificacion de ansiedad",
  "pregunta": "Clasificacion de ansiedad: relaciona cada puntaje con su categoria correspondiente.",
  "respuesta": "puntaje < 30 = Baja, < 70 = Media, >= 70 = Alta",
  "drags": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 25"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 55"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 85"}
  ],
  "targets": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f7e2.png", "valor": "Baja"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f7e1.png", "valor": "Media"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f534.png", "valor": "Alta"}
  ],
  "descripcion": "Determinar si la ansiedad es baja, media o alta segun el puntaje.",
  "funcion": "clasificarAnsiedad",
  "formula": "puntaje < 30 = Baja, < 70 = Media, >= 70 = Alta",
  "entrada": [50],
  "esperado": "Media",
  "codigo": "function clasificarAnsiedad(puntaje){\\n\\n}"
}');

-- 3) Estres laboral (burnout)
INSERT INTO tablajson (columnajson) VALUES ('{
  "titulo": "Estres laboral",
  "pregunta": "Estres laboral: relaciona cada escenario de trabajo con su resultado de riesgo de burnout.",
  "respuesta": "estres > 80 && horasExtra > 20  =>  true",
  "drags": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f62b.png", "valor": "Estres 90 / Horas extra 25"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f642.png", "valor": "Estres 50 / Horas extra 10"}
  ],
  "targets": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f525.png", "valor": "Riesgo de burnout: true"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/2705.png", "valor": "Sin riesgo: false"}
  ],
  "descripcion": "Determinar si existe riesgo de burnout segun el estres y las horas extra.",
  "funcion": "evaluarBurnout",
  "formula": "estres > 80 && horasExtra > 20",
  "entrada": [90, 25],
  "esperado": true,
  "codigo": "function evaluarBurnout(estres, horasExtra){\\n\\n}"
}');

-- 4) Riesgo de insomnio
INSERT INTO tablajson (columnajson) VALUES ('{
  "titulo": "Riesgo de insomnio",
  "pregunta": "Riesgo de insomnio: relaciona cada combinacion de habitos nocturnos con su resultado de riesgo.",
  "respuesta": "(pantalla > 3 && cafeina > 2) || estres > 70  =>  true",
  "drags": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f635.png", "valor": "Pantalla 4h / Cafeina 3 / Estres 75"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f634.png", "valor": "Pantalla 1h / Cafeina 0 / Estres 20"}
  ],
  "targets": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f319.png", "valor": "Insomnio: true"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/2705.png", "valor": "Insomnio: false"}
  ],
  "descripcion": "Determinar si hay riesgo de insomnio segun pantalla, cafeina y estres.",
  "funcion": "evaluarInsomnio",
  "formula": "pantalla > 3 && cafeina > 2 || estres > 70",
  "entrada": [4, 3, 75],
  "esperado": true,
  "codigo": "function evaluarInsomnio(pantalla, cafeina, estres){\\n\\n}"
}');

-- 5) Nivel de ansiedad general
INSERT INTO tablajson (columnajson) VALUES ('{
  "titulo": "Nivel de ansiedad general",
  "pregunta": "Nivel de ansiedad general: ubica cada puntaje del paciente en el nivel correcto.",
  "respuesta": "0-30 Baja, 31-60 Media, 61-100 Alta",
  "drags": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 20"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 45"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f321.png", "valor": "Puntaje 65"}
  ],
  "targets": [
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f7e2.png", "valor": "Baja"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f7e1.png", "valor": "Media"},
    {"imagen": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f534.png", "valor": "Alta"}
  ],
  "descripcion": "Clasifica el nivel de ansiedad general del paciente segun el puntaje.",
  "funcion": "nivelAnsiedad",
  "formula": "0-30 Baja, 31-60 Media, 61-100 Alta",
  "entrada": [65],
  "esperado": "Alta",
  "codigo": "function nivelAnsiedad(puntaje){\\n\\n}"
}');

SELECT idEjercicio, JSON_EXTRACT(columnajson, '$.titulo') AS titulo FROM tablajson;
