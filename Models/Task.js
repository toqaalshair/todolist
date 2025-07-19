const { taskValidator } = require('../Validations');
const dbConnection = require('../Configurations/dbConnection');
const { ObjectId } = require('mongodb');
class Task {
    constructor(taskData) {
        this.taskData = taskData;
    }
    static validation(taskData) {
        console.log("Task validation");

        return new Promise((resolve, reject) => {
            if (!taskData || typeof taskData !== 'object') {
                return reject({ status: false, statusCode: 400, message: 'Invalid task data', data: null });
            }

            const validationResult = taskValidator(taskData);
            if (validationResult.error) {
                return reject({ status: false, statusCode: 401, message: validationResult.error.details[0].message, data: null });
            }

            resolve({ status: true, statusCode: 200, message: 'Task data is valid', data: validationResult.value });
        })
    }
    static isExists(taskId, _user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                taskId = new ObjectId(taskId)
                _user_id = new ObjectId(_user_id)

                const collection = await dbConnection('tasks');
                const task = await collection.findOne({ _id: taskId, _user_id: _user_id });
                console.log("Task", task);

                if (task) {
                    return resolve({ status: true, statusCode: 409, message: 'Task ID exists', data: task });
                } else {
                    return resolve({ status: false, statusCode: 404, message: 'Task ID not found', data: null });
                }
            } catch (error) {
                return reject({ status: false, statusCode: 500, message: error.message || 'Error checking task existence', data: null });
            }
        });

    }

    static async create(taskData, _user_id) {
        try {

            const validatedResult = await this.validation(taskData);
            if (!validatedResult.status) {
                return {
                    status: validatedResult.status,
                    statusCode: validatedResult.statusCode,
                    message: validatedResult.message,
                    data: null
                }
            } else {
                return new Promise(async (resolve, reject) => {
                    taskData.createdAt = new Date();
                    taskData.dueDate = new Date(taskData.dueDate);
                    taskData.status = taskData.status || 'pending';
                    taskData._user_id = new ObjectId(_user_id)
                    const collection = await dbConnection('tasks');
                    const task = await collection.insertOne(taskData)
                    if (task.acknowledged) {
                        resolve({
                            status: true,
                            statusCode: 201,
                            message: 'Task created successfully',
                            data: { _id: task.insertedId, createdAt: taskData.createdAt }
                        });
                    } else {
                        reject({
                            status: false,
                            statusCode: 500,
                            message: 'Task creation failed',
                            data: null
                        });
                    }
                })
            }
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error creating task',
                data: null
            };
        }
    }

    static async update(taskId, _user_id, taskData) {
        try {
            const existence = await Task.isExists(taskId, _user_id);
            if (!existence.status) {
                return {
                    status: existence.status,
                    statusCode: existence.statusCode,
                    message: existence.message,
                    data: null
                };
            } else {
                const validatedResult = await Task.validation(taskData);
                if (!validatedResult.status) {
                    return {
                        status: validatedResult.status,
                        statusCode: validatedResult.statusCode,
                        message: validatedResult.message,
                        data: null
                    };
                } else {
                    return new Promise(async (resolve, reject) => {
                        taskId = new ObjectId(taskId);
                        taskData.updatedAt = new Date();
                        taskData.dueDate = new Date(taskData.dueDate);

                        const collection = await dbConnection('tasks');
                        const updateResult = await collection.updateOne(
                            { _id: taskId },
                            { $set: taskData }
                        )
                        if (updateResult.modifiedCount > 0) {
                            resolve({
                                status: true,
                                statusCode: 200,
                                message: 'Task updated successfully',
                                data: taskData
                            });
                        } else {
                            resolve({
                                status: false,
                                statusCode: 404,
                                message: 'Task updating failed',
                                data: null
                            });
                        }
                    })

                }
            }
        }
        catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error updating task',
                data: null
            };
        }
    }
    static async delete(taskId, _user_id) {
        try {
            const existence = await Task.isExists(taskId, _user_id);
            if (!existence.status) {
                return {
                    status: existence.status,
                    statusCode: existence.statusCode,
                    message: existence.message,
                    data: null
                };
            } else {
                return new Promise(async (resolve, reject) => {
                    taskId = new ObjectId(taskId);
                    const collection = await dbConnection('tasks');
                    const deleteResult = await collection.deleteOne(
                        existence.data
                    )
                    if (deleteResult.deletedCount > 0) {
                        resolve({
                            status: true,
                            statusCode: 200,
                            message: 'Task deleteed successfully',
                            data: deleteResult
                        });
                    } else {
                        resolve({
                            status: false,
                            statusCode: 404,
                            message: 'Task deleting failed',
                            data: null
                        });
                    }
                })

            }
        }

        catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error updating task',
                data: null
            };
        }
    }
    static async getAll(_user_id) {
        try {
            _user_id = new ObjectId(_user_id)
            return new Promise(async (resolve, reject) => {
                const collection = await dbConnection('tasks');
                const tasks = await collection.find({ _user_id: _user_id },
                    { projection: { _id: 1, title: 1, description: 1, dueDate: 1, status: 1, createdAt: 1, updatedAt: 1 } }
                ).toArray();
                if (tasks.length > 0) {
                    resolve({
                        status: true,
                        statusCode: 200,
                        message: 'Tasks retrieved successfully',
                        data: tasks
                    });
                } else {
                    resolve({
                        status: false,
                        statusCode: 404,
                        message: 'No tasks found',
                        data: null
                    });
                }
            })


        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error getting all tasks',
                data: null
            };
        }
    }
    static async getById(taskId, _user_id) {
        try {
            const existence = await Task.isExists(taskId, _user_id);
            if (!existence.status) {
                return {
                    status: existence.status,
                    statusCode: 404,
                    message: existence.message,
                    data: null
                };
            } else {
                return new Promise(async (resolve, reject) => {
                    taskId = new ObjectId(taskId);
                    const collection = await dbConnection('tasks');
                    const task = await collection.findOne({ _id: taskId },
                        { projection: { _id: 1, title: 1, description: 1, dueDate: 1, status: 1, createdAt: 1, updatedAt: 1 } }

                    );
                    if (task) {
                        resolve({
                            status: true,
                            statusCode: 200,
                            message: 'Task retrieved successfully',
                            data: task
                        });
                    } else {
                        resolve({
                            status: false,
                            statusCode: 404,
                            message: 'Task not found',
                            data: null
                        });
                    }
                })
            }
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error getting task by ID',
                data: null
            };
        }
    }
    static async getByStatus(status, _user_id) {
        try {
            _user_id = new ObjectId(_user_id)
            return new Promise(async (resolve, reject) => {
                const collection = await dbConnection('tasks');
                const tasks = await collection.find({ status: status, _user_id: _user_id },
                    { projection: { _id: 1, title: 1, description: 1, dueDate: 1, status: 1, createdAt: 1, updatedAt: 1 } }

                ).toArray();
                if (tasks.length > 0) {
                    resolve({
                        status: true,
                        statusCode: 200,
                        message: 'Tasks retrieved successfully',
                        data: tasks
                    });
                } else {
                    resolve({
                        status: false,
                        statusCode: 404,
                        message: 'No tasks found with the given status',
                        data: null
                    });
                }
            })
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error getting tasks by status',
                data: null
            };
        }
    }
    static async getendOfNextDay(_user_id) {
        try {
            _user_id = new ObjectId(_user_id);
            return new Promise(async (resolve, reject) => {
                const collection = await dbConnection('tasks');
                const currentDate = new Date();

                const nextDay = new Date(currentDate);
                nextDay.setDate(currentDate.getDate() + 1);
                nextDay.setHours(0, 0, 0, 0);

                const endOfNextDay = new Date(nextDay);
                endOfNextDay.setHours(23, 59, 59, 999);

                const tasks = await collection.find({
                    dueDate: { $gte: nextDay, $lte: endOfNextDay },
                    _user_id: _user_id
                }, { projection: { _id: 1, title: 1, description: 1, dueDate: 1, status: 1, createdAt: 1, updatedAt: 1 } }

                ).toArray();
                console.log("Tasks for end of next day:", tasks);


                if (tasks.length > 0) {
                    resolve({
                        status: true,
                        statusCode: 200,
                        message: 'Tasks retrieved successfully',
                        data: tasks
                    });
                } else {
                    resolve({
                        status: false,
                        statusCode: 404,
                        message: 'No tasks found for the next day',
                        data: null
                    });
                }
            });
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message || 'Error getting tasks for the end of next day',
                data: null
            };
        }
    }











}
module.exports = Task;