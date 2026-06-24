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
    // usuario / password: Campos controlados del formulario
    // condition: Booleano que indica si el usuario está autenticado
    // tipousuario: Tipo de usuario ('administrador' | 'usuario')
    // usuarioNoValido: Booleano para redirigir a página de error
    // ============================================================
    this.state = {
      usuario: '',
      password: '',
      condition: false,
      tipousuario: '',
      usuarioNoValido: false
    };
  }

  // ============================================================
  // MÉTODO: handleChange
  // ============================================================
  // Mantiene el estado sincronizado con los inputs controlados
  // (Reemplaza el acceso directo al DOM con document.getElementById)
  // ============================================================
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // ============================================================
  // MÉTODO: validar
  // ============================================================
  // Validación local de credenciales (sin backend):
  //   - Contraseña "1234" -> administrador  -> /administrator
  //   - Contraseña "4321" -> usuario        -> /psico (Psico-Educación)
  //   - Cualquier otra                      -> /no-valido
  // ============================================================
  validar = () => {
    const usuario = this.state.usuario.trim();
    const password = this.state.password.trim();

    // ============================================================
    // CASO 1: USUARIO VÁLIDO - ADMINISTRADOR
    // ============================================================
    if (usuario && password === "1234") {
      Swal.fire({
        icon: 'success',
        title: '¡Usuario Válido!',
        text: 'Bienvenido al panel de administración de SerenaMente.'
      }).then(() => {
        this.setState({ condition: true, tipousuario: 'administrador' });
      });

    // ============================================================
    // CASO 2: USUARIO VÁLIDO - USUARIO ESTÁNDAR
    // ============================================================
    } else if (usuario && password === "4321") {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Accediendo a Psico-Educación.'
      }).then(() => {
        this.setState({ condition: true, tipousuario: 'usuario' });
      });

    // ============================================================
    // CASO 3: USUARIO NO VÁLIDO
    // ============================================================
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Usuario o contraseña incorrectos.'
      }).then(() => {
        this.setState({
          usuario: '',
          password: '',
          condition: false,
          tipousuario: '',
          usuarioNoValido: true
        });
      });
    }
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
      usuario,
      password,
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

    // Si es un usuario estándar autenticado -> Psico-Educación
    if (condition && tipousuario === "usuario") {
      return <Navigate to="/psico" />;
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
                    name="usuario"
                    value={usuario}
                    onChange={this.handleChange}
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
                    name="password"
                    value={password}
                    onChange={this.handleChange}
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
                  onClick={this.validar}
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