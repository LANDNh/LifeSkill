'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Character, {
        foreignKey: 'userId'
      });
      User.hasMany(models.Quest, {
        foreignKey: 'userId'
      });
      User.hasMany(models.Friend, {
        foreignKey: 'addresserId',
        as: 'SentRequests'
      });
      User.hasMany(models.Friend, {
        foreignKey: 'addresseeId',
        as: 'RecievedRequests'
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
        // isGoogleOAuth(value, { isGoogleOAuth }) {
        //   if (!isGoogleOAuth && (value.length < 3 || value.length > 50)) {
        //     throw new Error("First name must be between 3 and 50 characters.");
        //   }
        // }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
        // isGoogleOAuth(value, { isGoogleOAuth }) {
        //   if (!isGoogleOAuth && (value.length < 3 || value.length > 50)) {
        //     throw new Error("Last name must be between 3 and 50 characters.");
        //   }
        // }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 50],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        },
        // isGoogleOAuth(value, { isGoogleOAuth }) {
        //   if (!isGoogleOAuth && (value.length < 4 || value.length > 50)) {
        //     throw new Error("Username must be between 4 and 50 characters.");
        //   }
        // }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: true,
      validate: {
        len: [60, 60]
      }
    },
    googleId: { // For Google OAuth
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'User',
    // hooks: {
    //   beforeCreate: (user, options) => {
    //     if (options.isGoogleOAuth) {
    //       user.setDataValue('firstName', user.firstName);
    //       user.setDataValue('lastName', user.lastName);
    //       user.setDataValue('username', user.username);
    //     }
    //   }
    // },
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
