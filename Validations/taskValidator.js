const joi = require('@hapi/joi');
const taskValidator = (task) => {
    const schema = joi.object({
        title: joi.string().min(3).max(50).required(),
        description: joi.string().min(5).max(200).optional(),
        dueDate: joi.date().iso().required(),
        status: joi.string().valid('pending', 'completed').default('pending'),
        createdAt: joi.date().iso().default(() => new Date())
    });

    return schema.validate(task);
};
module.exports = taskValidator;                       
