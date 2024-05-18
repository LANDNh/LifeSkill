'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Friend.belongsTo(models.User, {
        foreignKey: 'addresserId',
        as: 'Addresser'
      });
      Friend.belongsTo(models.User, {
        foreignKey: 'addresseeId',
        as: 'Addressee'
      });
    }
  }
  Friend.init({
    addresserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addresseeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['pending', 'accepted', 'rejected']]
      }
    }
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};
