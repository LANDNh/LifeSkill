'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Character } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Character.bulkCreate([
      {
        userId: 1,
        name: 'Demo-lition',
        skin: 1,
        eyes: 1,
        status: 'I love being a demo!'
      },
      {
        userId: 2,
        name: 'FakeUser1',
        skin: 1,
        eyes: 1,
        status: 'I love being the first fake user!'
      },
      {
        userId: 3,
        name: 'FakeUser2',
        skin: 1,
        eyes: 1,
        status: 'I love being the second fake user!'
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Characters';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
