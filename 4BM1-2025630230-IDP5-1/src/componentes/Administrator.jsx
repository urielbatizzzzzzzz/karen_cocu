import React from "react";
import { Button, Container, Table, Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import Pregunta from "./Pregunta.jsx"
import { parseColumnaJson } from "./utils.js";
import axios from "axios";

class Administrator extends React.Component 
{

    state = {
        data: [],
        showAlert: false,
        alertText: ""
    }

    componentDidMount() {
        axios.get("/Preguntas").then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.info(error);
            this.setState({ showAlert: true, alertText: "ERROR EN LA OBTENCION DE DATOS" });
        })
    } 

    
    render() {
        const {data,showAlert, alertText } = this.state;        
        return (
            <Container className="MarginContainer mt-4 p-4 center-container">

                <h1 className="AlignCenter" > CREAR, ALTAS, BAJAS Y CAMBIOS </h1>
                <hr style={{ width: "80%" }} />
                {
                    showAlert ?
                        <Alert variant="danger">
                            {alertText}
                        </Alert>
                        : null
                }
                <div className="crud-toolbar">
                    <Button variant="primary">
                        <Link to="/formulario" className="CustomLink">+ NUEVA PREGUNTA</Link>
                    </Button>
                    <Button variant="info">
                        <Link to="/probar" className="CustomLink">💡 Pedir ayuda IA</Link>
                    </Button>
                </div>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(item => {
                                const datos = parseColumnaJson(item.columnajson);
                                const preguntaTexto = datos.pregunta || "";

                                return (
                                    <Pregunta 
                                        key={item.idEjercicio} 
                                        idEjercicio={item.idEjercicio} 
                                        pregunta={preguntaTexto} 
                                    />
                                );
                            })
                        }
                    </tbody>
                </Table>

            </Container>
        )
    }

}

export default Administrator;