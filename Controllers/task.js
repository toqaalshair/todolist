const returnJSON = require('../returnJSON');
const Task = require('../Models/Task');
const createError = require('http-errors');


const taskController = {
    create: async (req, res, next) => {
        try {
            console.log("JSON", returnJSON);
            const taskData = req.body;
            const _user_id = req._user_id
            const result = await Task.create(taskData, _user_id);
            console.log(result.statusCode);

            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to create task'));
            } else {
                returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );

            }

        } catch (error) {
            return next(createError(500, error.message));
        }
    },
    update: async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const _user_id = req._user_id
            const result = await Task.update(taskId, _user_id, taskData);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to update task'));
            } else {
                return returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );
            }
        } catch (error) {
            return next(createError(500, error.message));
        }
    },
    delete: async (req, res, next) => {
        try {
            const taskId = req.params.id;
            _user_id = req._user_id
            const result = await Task.delete(taskId, _user_id);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to delete task'));
            } else {
                return returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );
            }
        } catch (error) {
            return next(createError(500, error.message));
        }
    },
    getAll: async (req, res, next) => {
        try {
            const _user_id = req._user_id
            const result = await Task.getAll(_user_id);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to retrieve tasks'));
            } else {
                return returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );
            }
        } catch (error) {
            return next(createError(500, error.message));
        }
    },
    getById: async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const _user_id = req._user_id
            const result = await Task.getById(taskId, _user_id);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to retrieve task'));
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
            return next(createError(500, error.message));
        }
    },
    getByStatus: async (req, res, next) => {
        try {
            const status = req.params.status;
            const _user_id = req._user_id
            const result = await Task.getByStatus(status, _user_id);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to retrieve tasks by status'));
            } else {
                return returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );
            }
        } catch (error) {
            return next(createError(500, error.message));
        }
    },
    getendOfNextDay: async (req, res, next) => {
        try {
            const _user_id = req._user_id
            const result = await Task.getendOfNextDay(_user_id);
            if (!result || !result.status) {
                return next(createError(result.statusCode || 500, result.message || 'Failed to retrieve tasks for end of next day'));
            } else {
                return returnJSON(
                    res,
                    parseInt(result.statusCode),
                    result.status,
                    result.message,
                    result.data
                );
            }
        } catch (error) {
            return next(createError(500, error.message));
        }
    }

};
module.exports = taskController;