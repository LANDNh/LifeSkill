'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QuestSteps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Quests' }
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      notes: {
        type: Sequelize.STRING(200),
      },
      difficulty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      xp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      complete: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "QuestSteps";
    return queryInterface.dropTable(options);
  }
};
