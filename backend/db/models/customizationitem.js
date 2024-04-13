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
      CustomizationItem.hasMany(models.CharacterCustomization, {
        foreignKey: 'itemId'
      });
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
    levelRequirement: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    available: {
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'CustomizationItem',
  });
  return CustomizationItem;
};
