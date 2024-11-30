'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.Character, {
        as: 'Sender', foreignKey: 'senderId'
      });
      Chat.belongsTo(models.Character, {
        as: 'Receiver', foreignKey: 'receiverId'
      });
    }
  }
  Chat.init({
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 500]
      }
    }
  }, {
    sequelize,
    modelName: 'Chat'
  });
  return Chat;
};
