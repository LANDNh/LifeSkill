'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomizationItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomizationItem.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['head', 'body', 'hand']]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.INTEGER,
    },
    levelRequirement: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CustomizationItem',
  });
  return CustomizationItem;
};
