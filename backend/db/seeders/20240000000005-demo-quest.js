'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Quest } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Quest.bulkCreate([
      {
        userId: 1,
        title: 'Morning Routine',
        description: 'The best way to start the day!',
        type: 'daily',
        difficultyAggregate: 1,
        completionCoins: 5,
        complete: false
      },
      {
        userId: 1,
        title: 'Grocery Hunting',
        description: 'Don\'t forget the essentials!',
        type: 'weekly',
        difficultyAggregate: 2,
        completionCoins: 20,
        complete: false
      },
      {
        userId: 1,
        title: 'Slay the Bills',
        description: 'Almost done with that credit card debt!',
        type: 'monthly',
        difficultyAggregate: 3,
        completionCoins: 60,
        complete: false
      },
      {
        userId: 1,
        title: 'Doctor\'s Visit',
        description: 'It\'s on the 27th of July!',
        type: 'none',
        difficultyAggregate: 4,
        completionCoins: 50,
        complete: false
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Quests';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['daily', 'weekly', 'monthly', 'none'] }
    }, {});
  }
};
