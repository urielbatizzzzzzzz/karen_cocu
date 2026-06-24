// ============================================================
// COMPONENTE: Login.jsx
// ============================================================
// DESCRIPCIÓN: Página de autenticación de SerenaMente
// FUNCIONALIDAD: Valida credenciales y redirige según el perfil
// ============================================================

// Importaciones de React y dependencias
import React from "react";
import { Navigate } from "react-router-dom";  // Para redirección programática
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap
import Swal from 'sweetalert2';               // Alertas personalizadas y bonitas

// ============================================================
// CLASE PRINCIPAL: Login
// ============================================================
// Hereda de React.Component para manejar estado y ciclo de vida
// ============================================================
class Login extends React.Component {
  
  // ============================================================
  // CONSTRUCTOR
  // ============================================================
  // Inicializa el estado del componente
  // ============================================================
  constructor() {
    super();  // Llama al constructor de la clase padre
    
    // ============================================================
    // STATE: Estado del componente
    // ============================================================
    // condition: Booleano que indica si el usuario está autenticado
    // tipousuario: Tipo de usuario ('administrador' u otros)
    // usuarioNoValido: Booleano para redirigir a página de error
    // ============================================================
    this.state = {
      condition: false,
      tipousuario: '',
      usuarioNoValido: false
    };
  }

  // ============================================================
  // MÉTODO: validar
  // ============================================================
  // Función flecha para mantener el contexto de 'this'
  // Valida las credenciales del usuario contra el backend
  // ============================================================
  validar = (usuario, password) => {
    
    // ============================================================
    // PETICIÓN FETCH AL BACKEND
    // ============================================================
    // Endpoint: /api/login (Método POST)
    // Body: { username, password } en formato JSON
    // ============================================================
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Indicamos que enviamos JSON
      },
      body: JSON.stringify({
        username: usuario,
        password: password
      })
    })
    
    // ============================================================
    // PROCESAMIENTO DE LA RESPUESTA
    // ============================================================
    // Paso 1: Convertir respuesta a JSON
    // Paso 2: Evaluar el resultado
    // ============================================================
    .then(response => response.json())
    .then(data => {
      
      // ============================================================
      // CASO 1: USUARIO VÁLIDO - ADMINISTRADOR
      // ============================================================
      // Si el status es "yes" y el tipo es "administrador"
      // ============================================================
      if (
        data.status === "yes" &&
        data.tipo === "administrador"
      ) {
        // Mostrar alerta de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: '¡Usuario Válido!',
          text: 'Bienvenido al sistema SerenaMente.'
        }).then(() => {
          // Actualizar el estado para redirigir al panel de administrador
          this.setState({
            condition: true,
            tipousuario: 'administrador'
          });
        });
        
      // ============================================================
      // CASO 2: USUARIO NO VÁLIDO
      // ============================================================
      // Si las credenciales son incorrectas o el usuario no existe
      // ============================================================
      } else {
        // Mostrar alerta de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: 'Usuario o contraseña incorrectos.'
        }).then(() => {
          // Limpiar los campos del formulario
          document.getElementById("user").value = "";
          document.getElementById("password").value = "";
          
          // Actualizar estado para redirigir a página de error
          this.setState({
            condition: false,
            tipousuario: '',
            usuarioNoValido: true
          });
        });
      }
    })
    
    // ============================================================
    // CASO 3: ERROR DE CONEXIÓN
    // ============================================================
    // Si no se puede conectar con el backend
    // ============================================================
    .catch(err => {
      // Mostrar alerta de error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar al servidor backend'
      });
      console.error(err);  // Registrar el error en consola
    });
  }

  // ============================================================
  // MÉTODO: render
  // ============================================================
  // Renderiza la interfaz de login
  // Incluye: fondo con imagen, formulario, campos y botón
  // ============================================================
  render() {
    
    // ============================================================
    // ESTILOS EN LÍNEA
    // ============================================================
    const styles = {
      padding: '5px'
    };

    // ============================================================
    // DESESTRUCTURACIÓN DEL STATE
    // ============================================================
    const {
      condition,
      tipousuario,
      usuarioNoValido
    } = this.state;

    // ============================================================
    // REDIRECCIONES CONDICIONALES
    // ============================================================
    
    // Si el usuario es administrador y está autenticado
    if (condition && tipousuario === "administrador") {
      return <Navigate to="/administrator" />;
    }
    
    // Si el usuario no es válido
    if (usuarioNoValido) {
      return <Navigate to="/no-valido" />;
    }

    // ============================================================
    // RENDERIZADO DEL FORMULARIO DE LOGIN
    // ============================================================
    return (
      // ============================================================
      // CONTENEDOR PRINCIPAL CON FONDO
      // ============================================================
      // login-background-container: Fondo con imagen terapéutica
      // ============================================================
      <div className="login-background-container">
        
        {/* ============================================================
            ENCABEZADO - FRANJA SUPERIOR
        ============================================================
            bg-primary: Fondo verde terapéutico
            text-white: Texto en blanco
        ============================================================ */}
        <div className="container-fluid p-5 bg-primary text-white text-center">
          <h1>SerenaMente - Control de Acceso</h1>
        </div>

        {/* ============================================================
            CUERPO DEL FORMULARIO
        ============================================================ */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-12">

              {/* ============================================================
                  TARJETA DEL LOGIN (Caja blanca central)
              ============================================================
                  center-container: Caja con sombra y bordes redondeados
              ============================================================ */}
              <div
                className="center-container"
                style={styles}
                id="equis"
              >

                {/* ============================================================
                    CAMPO: USUARIO
                ============================================================ */}
                <div className="form-group mb-3">
                  <label className="form-label" htmlFor="user">
                    Usuario
                  </label>
                  <input
                    placeholder="Ingrese el usuario"
                    type="text"
                    id="user"
                    className="form-control"
                  />
                </div>

                {/* ============================================================
                    CAMPO: CONTRASEÑA
                ============================================================ */}
                <div className="form-group mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    placeholder="Ingrese su contraseña"
                    type="password"
                    id="password"
                    className="form-control"
                  />
                </div>

                {/* ============================================================
                    BOTÓN: SUBMIT / INICIAR SESIÓN
                ============================================================
                    Al hacer clic, obtiene los valores de los inputs
                    y llama al método validar()
                ============================================================ */}
                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    this.validar(
                      document.getElementById("user").value,
                      document.getElementById("password").value
                    )
                  }
                >
                  Submit
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ============================================================
// EXPORTACIÓN DEL COMPONENTE
// ============================================================
// Se exporta por defecto para poder importarlo en otros archivos
// ============================================================
export default Login;