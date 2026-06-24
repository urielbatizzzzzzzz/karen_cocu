// ============================================================
// COMPONENTE: ProbarEjercicio.jsx
// ============================================================
// DESCRIPCIÓN: Editor de código para resolver ejercicios de programación
// FUNCIONALIDAD: Ejecuta código JavaScript, compara resultados y ofrece IA
// ============================================================

// Importaciones de React, Bootstrap y dependencias
import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import Editor from "@monaco-editor/react";  // Editor de código profesional
import axios from "axios";

// ============================================================
// CLASE PRINCIPAL: ProbarEjercicio
// ============================================================
class ProbarEjercicio extends React.Component {
  
  // ============================================================
  // REFERENCIAS A EDITOR Y MONACO
  // ============================================================
  editorRef = null;    // Referencia al editor de código
  monacoRef = null;    // Referencia a la API de Monaco

  // ============================================================
  // STATE: Estado del componente
  // ============================================================
  state = {
    // ============================================================
    // LISTA DE EJERCICIOS DISPONIBLES
    // ============================================================
    ejercicios: [
      {
        titulo: "Priorización de pacientes",
        descripcion: "Crear una función que calcule el nivel de riesgo emocional",
        funcion: "costoPaciente",
        formula: "ansiedad*0.5 + depresion*0.3 + tiempoEspera*0.2",
        entrada: [10, 20, 30],
        esperado: 17,
        codigo: `function costoPaciente(
  ansiedad,
  depresion,
  tiempoEspera
){

}`
      },
      {
        titulo: "Clasificación de ansiedad",
        descripcion: "Determinar si la ansiedad es baja, media o alta",
        funcion: "clasificarAnsiedad",
        formula: "puntaje < 30 = Baja, < 70 = Media, >= 70 = Alta",
        entrada: [50],
        esperado: "Media",
        codigo: `function clasificarAnsiedad(
  puntaje
){

}`
      },
      {
        titulo: "Estrés laboral",
        descripcion: "Determinar si existe riesgo de burnout",
        funcion: "evaluarBurnout",
        formula: "estres > 80 && horasExtra > 20",
        entrada: [90, 25],
        esperado: true,
        codigo: `function evaluarBurnout(
  estres,
  horasExtra
){

}`
      },
      {
        titulo: "Riesgo de insomnio",
        descripcion: "Determinar si hay riesgo de insomnio",
        funcion: "evaluarInsomnio",
        formula: "pantalla > 3 && cafeina > 2 || estres > 70",
        entrada: [4, 3, 75],
        esperado: true,
        codigo: `function evaluarInsomnio(
  pantalla,
  cafeina,
  estres
){

}`
      },
      {
        titulo: "Nivel de ansiedad general",
        descripcion: "Clasifica el nivel de ansiedad del paciente",
        funcion: "nivelAnsiedad",
        formula: "0-30 Baja, 31-60 Media, 61-100 Alta",
        entrada: [65],
        esperado: "Alta",
        codigo: `function nivelAnsiedad(
  puntaje
){

}`
      }
    ],

    // ============================================================
    // ESTADO DE EJECUCIÓN
    // ============================================================
    ejercicio: null,        // Ejercicio actualmente seleccionado
    codigo: "",            // Código escrito por el usuario
    resultado: "",         // VERDADERO, FALSO o ERROR
    salida: "",            // Valor de retorno de la función
    tiempo: 0,             // Tiempo de ejecución en segundos
    ayudaIA: "",           // Respuesta del asistente IA
    cargandoIA: false,     // Indicador de carga de IA
    sugerenciaGhost: ""    // Sugerencia de autocompletado
  };

  // ============================================================
  // CICLO DE VIDA: componentDidMount
  // ============================================================
  // Se ejecuta al montar el componente
  // Inicializa el temporizador y carga el primer ejercicio
  // ============================================================
  componentDidMount() {
    this.inicio = Date.now();  // Registrar tiempo de inicio
    const ejercicio = this.state.ejercicios[0];  // Tomar el primer ejercicio
    this.setState({ ejercicio, codigo: ejercicio.codigo });
  }

  // ============================================================
  // MÉTODO: ejecutar
  // ============================================================
  // Ejecuta el código escrito por el usuario
  // Compara el resultado con el valor esperado
  // ============================================================
  ejecutar = () => {
    // Calcular tiempo de ejecución
    const fin = Date.now();
    const segundos = Math.floor((fin - this.inicio) / 1000);

    try {
      // Obtener el ejercicio actual
      const ejercicio = this.state.ejercicio;
      
      // Convertir los parámetros de entrada a string
      const params = ejercicio.entrada.map(v => JSON.stringify(v)).join(",");

      // ============================================================
      // CREAR FUNCIÓN DINÁMICAMENTE
      // ============================================================
      // Se usa new Function() para evaluar el código del usuario
      // Se inyecta el código y se llama a la función con los parámetros
      // ============================================================
      const fn = new Function(`
        ${this.state.codigo}
        return ${ejercicio.funcion}(${params});
      `);

      // Ejecutar la función del usuario
      const resultado = fn();

      // ============================================================
      // COMPARAR RESULTADOS
      // ============================================================
      // Se compara el resultado del usuario con el esperado
      // Se usa JSON.stringify para comparar objetos complejos
      // ============================================================
      this.setState({
        resultado:
          JSON.stringify(resultado) === JSON.stringify(ejercicio.esperado)
            ? "VERDADERO"   // Coincide con lo esperado
            : "FALSO",      // No coincide
        salida: JSON.stringify(resultado),
        tiempo: segundos
      });
    } catch (err) {
      // ============================================================
      // MANEJO DE ERRORES
      // ============================================================
      // Si el código tiene errores de sintaxis o lógica
      // ============================================================
      this.setState({
        resultado: "ERROR",
        salida: err.message,
        tiempo: segundos
      });
    }
  };

  // ============================================================
  // MÉTODO: pedirAyudaIA
  // ============================================================
  // Solicita ayuda a la IA para resolver el ejercicio
  // Envía el código y el contexto del ejercicio
  // ============================================================
  pedirAyudaIA = async () => {
    this.setState({ cargandoIA: true });  // Mostrar indicador de carga

    try {
      // ============================================================
      // PETICIÓN POST A /api/ia
      // ============================================================
      // Body: código del usuario, función y parámetros de entrada
      // ============================================================
      const res = await axios.post("/api/ia", {
        codigo: this.state.codigo,
        funcion: this.state.ejercicio?.funcion,
        entrada: this.state.ejercicio?.entrada
      });

      // Mostrar la respuesta de la IA
      this.setState({
        ayudaIA: res.data.respuesta,
        cargandoIA: false
      });
    } catch (err) {
      // Manejar errores de conexión
      this.setState({
        ayudaIA: "Error IA",
        cargandoIA: false
      });
    }
  };

  // ============================================================
  // MÉTODO: pedirTutorIA
  // ============================================================
  // Solicita al tutor IA un análisis más profundo
  // Envía el código completo y el contexto del ejercicio
  // ============================================================
  pedirTutorIA = async () => {
    this.setState({ cargandoIA: true });

    try {
      // ============================================================
      // PETICIÓN POST A /api/ia-tutor
      // ============================================================
      // Body: código completo y contexto del ejercicio
      // ============================================================
      const res = await axios.post("/api/ia-tutor", {
        codigo: this.state.codigo,
        contexto: this.state.ejercicio
      });

      this.setState({
        ayudaIA: res.data.respuesta,
        cargandoIA: false
      });
    } catch (err) {
      this.setState({
        ayudaIA: "Error Tutor IA",
        cargandoIA: false
      });
    }
  };

  // ============================================================
  // MÉTODO: cambiarEjercicio
  // ============================================================
  // Cambia el ejercicio seleccionado en el dropdown
  // Actualiza el estado con el nuevo ejercicio y su código
  // ============================================================
  cambiarEjercicio = (e) => {
    const ejercicio = this.state.ejercicios[e.target.value];
    this.setState({
      ejercicio,
      codigo: ejercicio.codigo
    });
  };

  // ============================================================
  // MÉTODO: render
  // ============================================================
  // Renderiza la interfaz completa del editor
  // Incluye: selector, información del ejercicio, editor, resultados y botones
  // ============================================================
  render() {
    return (
      <Container className="serena-bg mt-4">
        
        {/* ============================================================
          ENCABEZADO PERSONALIZADO
        ============================================================ */}
        <div className="serena-header mb-3">
          {/* IZQUIERDA - Título */}
          <div className="serena-title">
            🌿 SerenaMente
          </div>
          {/* DERECHA - Subtítulo */}
          <div className="text-end">
            <div className="serena-subtitle">
              Asistente de codificación con IA para la salud mental
            </div>
          </div>
        </div>

        {/* ============================================================
          TARJETA PRINCIPAL
        ============================================================ */}
        <Card className="p-4 serena-card">

          {/* Título de la sección */}
          <h2 className="mb-3">Elige tu plantilla de ejercicio</h2>

          {/* ============================================================
            SELECTOR DE EJERCICIOS
          ============================================================
            Dropdown que permite cambiar entre los diferentes ejercicios
          ============================================================ */}
          <select
            className="form-select mb-3"
            onChange={this.cambiarEjercicio}
          >
            {this.state.ejercicios.map((e, i) => (
              <option key={i} value={i}>
                {e.titulo}
              </option>
            ))}
          </select>

          {/* ============================================================
            INFORMACIÓN DEL EJERCICIO
          ============================================================
            Muestra: título, descripción, regla, entrada y valor esperado
          ============================================================ */}
          <div className="mb-3">
            <h4>{this.state.ejercicio?.titulo}</h4>
            <p>{this.state.ejercicio?.descripcion}</p>
            <p><b>Regla:</b> {this.state.ejercicio?.formula}</p>
            <p><b>Entrada:</b> {JSON.stringify(this.state.ejercicio?.entrada)}</p>
            <p><b>Esperado:</b> {JSON.stringify(this.state.ejercicio?.esperado)}</p>
          </div>

          {/* ============================================================
            EDITOR DE CÓDIGO (MONACO)
          ============================================================
            Editor profesional de código con resaltado de sintaxis
            Tema oscuro para mayor comodidad visual
          ============================================================ */}
          <Editor
            height="450px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={this.state.codigo}
            onMount={(editor, monaco) => {
              this.editorRef = editor;
              this.monacoRef = monaco;
            }}
            onChange={(value) => {
              this.setState({ codigo: value || "" });
            }}
          />

          {/* ============================================================
            RESULTADOS DE EJECUCIÓN
          ============================================================
            Muestra: resultado (VERDADERO/FALSO/ERROR), salida y tiempo
          ============================================================ */}
          <div className="mt-3">
            <h5>Resultado: {this.state.resultado}</h5>
            <h5>Salida: {this.state.salida}</h5>
            <h5>Tiempo: {this.state.tiempo}s</h5>
          </div>

          {/* ============================================================
            BOTONES DE ACCIÓN
          ============================================================
            Ejecutar: Ejecuta el código
            Pedir ayuda IA: Sugerencias para resolver el ejercicio
            IA Tutor: Análisis más profundo del código
          ============================================================ */}
          <div className="d-flex gap-3 mt-3">
            <Button variant="success" onClick={this.ejecutar}>
              Ejecutar
            </Button>

            <Button variant="primary" onClick={this.pedirAyudaIA}>
              Pedir ayuda IA
            </Button>

            <Button variant="info" onClick={this.pedirTutorIA}>
              IA Tutor
            </Button>
          </div>

        </Card>
      </Container>
    );
  }
}

// ============================================================
// EXPORTACIÓN DEL COMPONENTE
// ============================================================
export default ProbarEjercicio;