import React from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { parseColumnaJson } from "./utils.js";
import axios from "axios";
import Swal from "sweetalert2";

class Formulario extends React.Component {
    state = {
        id: "",
        pregunta: "",
        respuesta: "",
        drags: [], // Lista de { imagen: "", valor: "" }
        targets: [], // Lista de { imagen: "", valor: "" }
        redirect: false,
        esEdicion: false
    };

    componentDidMount() {
        const qId = new URLSearchParams(window.location.search).get("id");
        
        if (!qId || qId === "undefined" || qId === "null") {
            console.log("Modo: Crear nueva pregunta.");
            return; 
        }

        axios.get(`/Pregunta?id=${qId}`)
            .then(response => {
                const question = response.data[0];
                if (question && question.columnajson) {
                    const datosLimpios = parseColumnaJson(question.columnajson);

                    this.setState({
                        id: question.idEjercicio,
                        pregunta: datosLimpios.pregunta || "",
                        respuesta: datosLimpios.respuesta || "",
                        drags: datosLimpios.drags || [],
                        targets: datosLimpios.targets || [],
                        esEdicion: true
                    });
                }
            })
            .catch(err => console.error("Error cargando la pregunta:", err));
    }
    // Manejar cambios en los inputs básicos (pregunta y respuesta)
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    // --- MANEJO DE OPCIONES DE ARRASTRE (DRAGS) ---
    agregarDrag = () => {
        this.setState({
            drags: [...this.state.drags, { imagen: "", valor: "" }]
        });
    };
    eliminarDrag = (index) => {
        const nuevosDrags = this.state.drags.filter((_, i) => i !== index);
        this.setState({ drags: nuevosDrags });
    };
    handleDragChange = (index, campo, valor) => {
        const nuevosDrags = [...this.state.drags];
        nuevosDrags[index][campo] = valor;
        this.setState({ drags: nuevosDrags });
    };
    // --- MANEJO DE OPCIONES DESTINO (TARGETS) ---
    agregarTarget = () => {
        this.setState({
            targets: [...this.state.targets, { imagen: "", valor: "" }]
        });
    };
    eliminarTarget = (index) => {
        const nuevosTargets = this.state.targets.filter((_, i) => i !== index);
        this.setState({ targets: nuevosTargets });
    };
    handleTargetChange = (index, campo, valor) => {
        const nuevosTargets = [...this.state.targets];
        nuevosTargets[index][campo] = valor;
        this.setState({ targets: nuevosTargets });
    };
    // --- ENVIAR FORMULARIO (GUARDAR O ACTUALIZAR) ---
    handleSubmit = (e) => {
        e.preventDefault();
        const { id, pregunta, respuesta, drags, targets } = this.state;

        // Juntamos toda la estructura que el backend necesita empaquetar
        const dataToSend = {
            idEjercicio: id, // Si está vacío va como "", el backend sabrá que es INSERT
            pregunta,
            respuesta,
            drags,
            targets
        };

        // Apuntamos al endpoint unificado que acabamos de blindar en el Backend
        axios.post('/Pregunta', dataToSend)
            .then(response => {
                if (response.data.status === "yes") {
                    Swal.fire("¡Éxito!", response.data.message, "success");
                    this.setState({ redirect: true });
                } else {
                    Swal.fire("Error", "No se pudo procesar la solicitud.", "error");
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "Error de conexión con el servidor.", "error");
            });
    };

    render() {
        const { pregunta, respuesta, drags, targets, redirect, esEdicion } = this.state;

        if (redirect) {
            return <Navigate to="/administrator" />;
        }

        return (
            <Container className="MarginContainer mt-4">
                <Card className="p-4 shadow-sm">
                    <h2>{esEdicion ? "Editar Pregunta" : "Nueva Pregunta"} - SerenaMente</h2>
                    <hr />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Texto de la Pregunta</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="pregunta" 
                                value={pregunta} 
                                onChange={this.handleChange} 
                                placeholder="Ej. Relaciona el estado de ánimo con la actividad"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Respuesta Correcta / Guía</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="respuesta" 
                                value={respuesta} 
                                onChange={this.handleChange} 
                                placeholder="Ej. Feliz - Sonreír"
                            />
                        </Form.Group>

                        {/* SECCIÓN DRAG OPTIONS */}
                        <div className="mb-4">
                            <h4>Opciones de Arrastre (Drag Options)</h4>
                            {drags.map((drag, index) => (
                                <Row key={index} className="align-items-center mb-2">
                                    <Col md={5}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Ruta de imagen (Ej: ../img/feliz.png)" 
                                            value={drag.imagen}
                                            onChange={(e) => this.handleDragChange(index, "imagen", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Valor / Texto representativo" 
                                            value={drag.valor}
                                            onChange={(e) => this.handleDragChange(index, "valor", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="danger" onClick={() => this.eliminarDrag(index)}>Eliminar</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="outline-success" size="sm" onClick={this.agregarDrag}>
                                + Añadir Opción de Arrastre
                            </Button>
                        </div>

                        {/* SECCIÓN TARGET OPTIONS */}
                        <div className="mb-4">
                            <h4>Opciones Destino (Target Options)</h4>
                            {targets.map((target, index) => (
                                <Row key={index} className="align-items-center mb-2">
                                    <Col md={5}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Ruta de imagen o área" 
                                            value={target.imagen}
                                            onChange={(e) => this.handleTargetChange(index, "imagen", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Valor esperado" 
                                            value={target.valor}
                                            onChange={(e) => this.handleTargetChange(index, "valor", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="danger" onClick={() => this.eliminarTarget(index)}>Eliminar</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="outline-success" size="sm" onClick={this.agregarTarget}>
                                + Añadir Opción Destino
                            </Button>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/administrator" className="btn btn-secondary">Cancelar</Link>
                            <Button variant="primary" type="submit">Guardar Pregunta</Button>
                        </div>
                    </Form>
                </Card>
            </Container>
        );
    }
}
export default Formulario;
