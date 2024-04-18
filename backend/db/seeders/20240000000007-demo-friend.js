'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Friend } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Friend.bulkCreate([
      {
        addresserId: 1,
        addresseeId: 2,
        status: 'pending'
      },
      {
        addresserId: 3,
        addresseeId: 1,
        status: 'accepted'
      },
      {
        addresserId: 2,
        addresseeId: 3,
        status: 'rejected'
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Friends';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['pending', 'accepted', 'rejected'] }
    }, {});
  }
};
