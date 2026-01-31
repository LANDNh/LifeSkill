'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Quests';
    await queryInterface.addColumn(options.tableName, 'availableAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Quests';
    await queryInterface.removeColumn(
      options.tableName,
      'availableAt',
      options
    );
  }
};
