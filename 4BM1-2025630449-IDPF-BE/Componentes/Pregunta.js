const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Pregunta = sequelize.define('Pregunta', {
    idEjercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pregunta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    respuesta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tablajson',
    timestamps: false
});

module.exports = Pregunta;