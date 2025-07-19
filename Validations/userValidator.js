const joi = require("@hapi/joi");
const signupValidator = joi.object({
  userName: joi.string().min(2).max(25).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/))
    .required(),
});
const loginValidator = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/))
    .required(),
});
module.exports = { signupValidator, loginValidator };
