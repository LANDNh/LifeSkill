'use strict';

/** @type {import('sequelize-cli').Migration} */

const { CharacterCustomization } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await CharacterCustomization.bulkCreate([
      {
        characterId: 1,
        itemId: 1,
        equipped: true
      },
      {
        characterId: 1,
        itemId: 3,
        equipped: false
      },
      {
        characterId: 1,
        itemId: 5,
        equipped: true
      },
      {
        characterId: 1,
        itemId: 7,
        equipped: false
      },
      {
        characterId: 1,
        itemId: 9,
        equipped: true
      },
      {
        characterId: 1,
        itemId: 11,
        equipped: false
      },
      {
        characterId: 2,
        itemId: 3,
        equipped: true
      },
      {
        characterId: 2,
        itemId: 7,
        equipped: true
      },
      {
        characterId: 2,
        itemId: 11,
        equipped: true
      },
      {
        characterId: 3,
        itemId: 1,
        equipped: true
      },
      {
        characterId: 3,
        itemId: 5,
        equipped: true
      },
      {
        characterId: 3,
        itemId: 9,
        equipped: true
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CharacterCustomizations';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      characterId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
