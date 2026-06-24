import React from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class Info extends React.Component {

    state = {
        id: "",
        pregunta: "",
        respuesta: "",
        drags: [],
        targets: []
    }

    componentDidMount() {
        const qId = new URLSearchParams(window.location.search).get("id");
        if (!qId || qId === "undefined" || qId === "null") {
            console.log("No hay ID en la URL, se asume que es una creación de pregunta nueva.");
            return; 
        }

        axios.get(`/Pregunta?id=${qId}`)
            .then(response => {
                const question = response.data[0];
                if (question) {
                    try {
                        const datosLimpios = JSON.parse(question.columnajson);
                        this.setState({
                            id: question.idEjercicio,
                            pregunta: datosLimpios.pregunta || "",
                            respuesta: datosLimpios.respuesta || "",
                            drags: datosLimpios.drags || [],
                            targets: datosLimpios.targets || [],
                            esEdicion: true
                        });
                    } catch (e) {
                        console.error("Error al parsear JSON:", e);
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    render() {
        const { pregunta, respuesta, drags, targets } = this.state;
        return (
            <Container className="MarginContainer">
            <nav>
            <Button variant="success" className="M-6">
                    <Link to={`/administrator`} className="CustomLink" >
                        CRUD
                    </Link>
                </Button>    
            </nav>
                <h3>Informacion de la pregunta</h3>
                <p>Pregunta: {pregunta}</p>
                <p>Respuesta: {respuesta}</p>
                <p className="fw-bold mt-4">Drag Options</p>
                <div className="DinámicaGrid">
                    {
                        drags.map((option, index) => {
                            return (
                                <span key={index} className="TarjetaOpción">
                                    <img src={`http://localhost:8080${option.imagen}`} 
                                        className="ImageContainer" 
                                        alt={option.valor}/>
                                    <p>{option.valor}</p>
                                </span>
                            );
                        })
                    }
                </div>
                <p className="fw-bold mt-2">Target Options (Acciones Saludables)</p>
                <div className="DinámicaGrid">
                    {
                        targets.map((target, index) => {
                            return (
                                <span key={index} className="TarjetaOpción">
                                    {/* Concatenamos el puerto del backend dinámicamente */}
                                    <img src={`http://localhost:8080${target.imagen}`} 
                                        className="ImageContainer" 
                                        alt={target.valor}/>
                                    <p>{target.valor}</p>
                                </span>
                            );
                        })
                    }
                </div>
            </Container>
        )
    }
}

export default Info;