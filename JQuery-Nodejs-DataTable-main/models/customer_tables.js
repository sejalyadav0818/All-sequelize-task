'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_tables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_tables.init({
    customer_firstname: DataTypes.STRING,
    customer_lastName: DataTypes.STRING,
    customer_email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer_tables',
  });
  return customer_tables;
};