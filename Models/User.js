const dbConnection = require('../Configurations/dbConnection');
const { signValidator, loginValidator } = require('../Validations');
const { hashSync, compareSync } = require("bcryptjs");
const redis = require('redis')

class User {
    constructor(userData) {
        this.userData = userData;
    }
    static validation(userData) {
        console.log("User validation");

        return new Promise((resolve, reject) => {
            if (!userData || typeof userData !== 'object') {
                return reject({ status: false, statusCode: 400, message: 'Invalid user data', data: null });
            }

            const validationResult = signValidator.validate(userData);
            if (validationResult.error) {
                return reject({ status: false, statusCode: 401, message: validationResult.error.details[0].message, data: null });
            }

            resolve({ status: true, statusCode: 200, message: 'user data is valid', data: validationResult.value });
        })
    }
    static isExists(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await dbConnection('users');
                const user = await collection.findOne({ email });

                if (user) {
                    return resolve({ status: true, statusCode: 409, message: 'user email exists', data: user });
                } else {
                    return resolve({ status: false, statusCode: 404, message: 'user email not found', data: null });
                }
            } catch (error) {
                return reject({ status: false, statusCode: 500, message: error.message || 'Error checking user existence', data: null });
            }
        });

    }
    static async create(userData) {
        try {
            const validatedResult = await User.validation(userData);
            if (!validatedResult.status) {
                return {
                    status: validatedResult.status,
                    statusCode: validatedResult.statusCode,
                    message: validatedResult.message,
                    data: null
                }
            } else {
                const existingUser = await User.isExists(userData.email);
                if (existingUser.status) {
                    return { status: existingUser.status, statusCode: existingUser.statusCode, message: existingUser.message, data: null };
                } else {
                    return new Promise(async (resolve, reject) => {
                        userData.password = hashSync(userData.password);
                        const collection = await dbConnection('users');
                        const user = await collection.insertOne(userData)
                        if (user.acknowledged) {
                            resolve({ status: true, statusCode: 201, message: 'User created successfully', data: { _id: user.insertedId } });
                        } else {
                            reject({ status: false, statusCode: 500, message: 'Failed to create user', data: null });
                        }
                    })
                }
            }
        } catch (error) {
            return { status: false, statusCode: 500, message: error.message || 'Error creating user', data: null };
        }
    }
    static async login(userData) {
        try {
            const validatedResult = loginValidator.validate(userData);
            if (validatedResult.error) {
                return { status: false, statusCode: 401, message: validatedResult.error.details[0].message, data: null };
            }

            const existenceCheck = await User.isExists(userData.email);
            if (!existenceCheck.status) {
                return { status: false, statusCode: existenceCheck.statusCode, message: existenceCheck.message, data: null };
            } else {
                const isPasswordValid = compareSync(userData.password, existenceCheck.data.password);
                if (!isPasswordValid) {
                    return { status: false, statusCode: 401, message: 'Invalid email or  password', data: null };
                }

                return { status: true, statusCode: 200, message: 'Login successful', data: existenceCheck.data };
            }
        } catch (error) {
            return { status: false, statusCode: 500, message: error.message || 'Error logging in', data: null };
        }


    }










}
module.exports = User;