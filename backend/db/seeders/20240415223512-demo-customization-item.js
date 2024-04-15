'use strict';

/** @type {import('sequelize-cli').Migration} */

const { CustomizationItem } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await CustomizationItem.bulkCreate([
      {
        type: 'head',
        description: 'Simple Glasses',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'head',
        description: 'Special Glasses',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
      {
        type: 'head',
        description: 'Simple Cap',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'head',
        description: 'Special Cap',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
      {
        type: 'body',
        description: 'Simple Robe',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'body',
        description: 'Special Robe',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
      {
        type: 'body',
        description: 'Simple Armor',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'body',
        description: 'Special Armor',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
      {
        type: 'hand',
        description: 'Simple Staff',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'hand',
        description: 'Special Staff',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
      {
        type: 'hand',
        description: 'Simple Sword',
        color: null,
        levelRequirement: 1,
        price: 5,
        available: null
      },
      {
        type: 'hand',
        description: 'Special Sword',
        color: null,
        levelRequirement: 2,
        price: 5,
        available: true
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
