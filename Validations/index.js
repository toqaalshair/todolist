const taskValidator = require("./taskValidator");
const userValidator = require("./userValidator");

module.exports = {
    taskValidator,
    signValidator: userValidator.signupValidator,
    loginValidator: userValidator.loginValidator
}