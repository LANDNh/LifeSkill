'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacterCustomization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CharacterCustomization.belongsTo(models.Character, {
        foreignKey: 'characterId'
      });
      CharacterCustomization.belongsTo(models.CustomizationItem, {
        foreignKey: 'itemId'
      });
    }
  }
  CharacterCustomization.init({
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    equipped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CharacterCustomization',
  });
  return CharacterCustomization;
};
