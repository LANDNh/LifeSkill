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
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-glasses.png'
      },
      {
        type: 'head',
        description: 'Special Glasses',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-glasses2.png'
      },
      {
        type: 'head',
        description: 'Simple Cap',
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-cap.png'
      },
      {
        type: 'head',
        description: 'Special Cap',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-cap2.png'
      },
      {
        type: 'body',
        description: 'Simple Robe',
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-robe.png'
      },
      {
        type: 'body',
        description: 'Special Robe',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-robe2.png'
      },
      {
        type: 'body',
        description: 'Simple Armor',
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-armor.png'
      },
      {
        type: 'body',
        description: 'Special Armor',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-armor2.png'
      },
      {
        type: 'hand',
        description: 'Simple Staff',
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-staff.png'
      },
      {
        type: 'hand',
        description: 'Special Staff',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-staff2.png'
      },
      {
        type: 'hand',
        description: 'Simple Sword',
        levelRequirement: 1,
        price: 5,
        available: null,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-sword.png'
      },
      {
        type: 'hand',
        description: 'Special Sword',
        levelRequirement: 2,
        price: 5,
        available: true,
        url: 'https://lifeskill-bucket.s3.amazonaws.com/images/ls-sword2.png'
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CustomizationItems';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['head', 'body', 'hand'] }
    }, {});
  }
};
