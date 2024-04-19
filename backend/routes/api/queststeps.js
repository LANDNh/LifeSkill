const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { QuestStep, Quest, Character } = require('../../db/models');

const router = express.Router();

module.exports = router;
