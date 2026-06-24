const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Pregunta = sequelize.define('Pregunta', {
    idEjercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    columnajson: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'tablajson',
    timestamps: false
});

module.exports = Pregunta;