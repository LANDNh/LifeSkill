'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RetainedAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RetainedAttribute.init({
    userId: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    totalXp: DataTypes.INTEGER,
    totalCoins: DataTypes.INTEGER,
    CharacterCustomizations: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'RetainedAttribute',
  });
  return RetainedAttribute;
};
