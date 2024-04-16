'use strict';

/** @type {import('sequelize-cli').Migration} */

const { QuestStep } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await QuestStep.bulkCreate([
      {
        questId: 1,
        title: 'Freshen Up',
        notes: 'Shower, shave, and anything else.',
        difficulty: 1,
        xp: 5
      },
      {
        questId: 1,
        title: 'Eat Breakfast',
        notes: 'Best meal of the day.',
        difficulty: 1,
        xp: 5
      },
      {
        questId: 1,
        title: 'Get Dressed',
        notes: 'Maybe get some new underwear.',
        difficulty: 1,
        xp: 5
      },
      {
        questId: 2,
        title: 'Purchase Meats',
        notes: 'Lunchmeat, ground beef, chicken breasts.',
        difficulty: 2,
        xp: 10
      },
      {
        questId: 2,
        title: 'Obtain Fruits & Veggies',
        notes: 'Bananas, avocados, tomatoes for this week.',
        difficulty: 2,
        xp: 10
      },
      {
        questId: 2,
        title: 'Puruse the Clothing',
        notes: 'Maybe get some new underwear.',
        difficulty: 2,
        xp: 10
      },
      {
        questId: 3,
        title: 'B.O.M. Bills',
        notes: 'Rent, utilities, credit cards.',
        difficulty: 3,
        xp: 20
      },
      {
        questId: 3,
        title: 'M.O.M. Bills',
        notes: 'Phone bills.',
        difficulty: 2,
        xp: 10
      },
      {
        questId: 3,
        title: 'E.O.M. Bills',
        notes: 'Car payment and insurance.',
        difficulty: 3,
        xp: 20
      },
      {
        questId: 4,
        title: 'Assemble Documents',
        notes: 'Everything is already in the green folder on the desk, even the birth certificate.',
        difficulty: 3,
        xp: 20
      },
      {
        questId: 4,
        title: 'Doctor Appointment',
        notes: 'Remember to prep the day before.',
        difficulty: 4,
        xp: 40
      },
      {
        questId: 4,
        title: 'Render Payment',
        notes: 'At least we have insurance?',
        difficulty: 5,
        xp: 80
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'QuestSteps';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      difficulty: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
