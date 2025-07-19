const auth = require('../Middleware/auth')
const taskRouter = require('./taskRouters');
const authRouter = require('./auth');
module.exports = (app) => {
    app.use('/tasks', auth, taskRouter)
        .use('/auth', authRouter)
}