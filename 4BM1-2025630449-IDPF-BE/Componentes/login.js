const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const Usuario = sequelize.define('usuario', {
    idLOGIN: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipousuario: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'login',
    timestamps: false
});

module.exports = Usuario;