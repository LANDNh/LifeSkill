'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quest.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Quest.hasMany(models.QuestStep, {
        foreignKey: 'questId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Quest.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['daily', 'weekly', 'monthly', 'none']]
      }
    },
    difficultyAggregate: DataTypes.INTEGER,
    completionCoins: DataTypes.INTEGER,
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Quest',
  });
  return Quest;
};
