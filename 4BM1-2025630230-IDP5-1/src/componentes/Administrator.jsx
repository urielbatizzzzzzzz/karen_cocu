import React from "react";
import { Button, Container, Table, Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import Pregunta from "./Pregunta.jsx"
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
                <Button variant="primary" style={{ margin: "12px" }}>

                    <Link to="/formulario" className="CustomLink">NUEVA PREGUNTA</Link>
                </Button>
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
                                let preguntaTexto = "";
                                try {
                                    if (item.columnajson) {
                                        const datos = JSON.parse(item.columnajson);
                                        preguntaTexto = datos.pregunta || "";
                                    }
                                } catch (e) {
                                    preguntaTexto = item.pregunta || "";
                                }

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