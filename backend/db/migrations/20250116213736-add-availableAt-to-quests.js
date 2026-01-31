'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const tableRef = options.schema
  ? { tableName: 'Quests', schema: options.schema }
  : 'Quests';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      tableRef,
      'availableAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      tableRef,
      'availableAt'
    );
  }
};
