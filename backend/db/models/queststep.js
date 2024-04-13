'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestStep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuestStep.belongsTo(models.Quest, {
        foreignKey: 'questId'
      });
    }
  }
  QuestStep.init({
    questId: {
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
    notes: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 200]
      }
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 5
      }
    }
  }, {
    sequelize,
    modelName: 'QuestStep',
  });
  return QuestStep;
};
