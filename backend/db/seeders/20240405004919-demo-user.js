'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'Lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Faker',
        lastName: 'User',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
    // const users = [
    //   {
    //     firstName: 'Demo',
    //     lastName: 'Lition',
    //     email: 'demo@user.io',
    //     username: 'Demo-lition',
    //     hashedPassword: bcrypt.hashSync('password')
    //   },
    //   {
    //     firstName: 'Fake',
    //     lastName: 'User',
    //     email: 'user1@user.io',
    //     username: 'FakeUser1',
    //     hashedPassword: bcrypt.hashSync('password2')
    //   },
    //   {
    //     firstName: 'Faker',
    //     lastName: 'User',
    //     email: 'user2@user.io',
    //     username: 'FakeUser2',
    //     hashedPassword: bcrypt.hashSync('password3')
    //   }
    // ];

    // try {
    //   await queryInterface.bulkInsert('Users', users, options);
    //   console.log('Seed successful!');
    // } catch (error) {
    //   console.error('Seed failed:', error);
    // }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
