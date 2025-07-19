const createError = require('http-errors');
const { User } = require('../Models');
const returnJSON = require('../returnJSON');
const { login, logout } = require('../Models/User');
const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await User.create(userData);
      if (!result && !result.status) {
        return next(createError(result.statusCode || 500, result.message || 'Failed to create user'));
      } else {
        return returnJSON(
          res,
          result.statusCode,
          result.status,
          result.message,
          result.data
        );
      }
    } catch (error) {
      return next(createError(500, error.message || 'Internal Server Error'));
    }
  },
  login: async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await User.login(userData);
      if (!result || !result.status) {
        return next(createError(result.statusCode || 500, result.message || 'Failed to login'));
      } else {
        return returnJSON(
          res,
          result.statusCode,
          result.status,
          result.message,
          jwt.sign({ _id: result.data._id }, process.env.JWT_SECRET)
        );
      }
    } catch (error) {
      return next(createError(500, error.message || 'Internal Server Error'));
    }
  },

}