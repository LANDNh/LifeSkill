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
        skin: 2,
        eyes: 2,
        status: 'I love being the second fake user!'
      },
      {
        userId: 4,
        name: 'FakeUser3',
        skin: 3,
        eyes: 3,
        status: 'I love being the third fake user!'
      },
      {
        userId: 5,
        name: 'JDoe',
        skin: 3,
        eyes: 3,
        status: 'Hello virtual world!'
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
