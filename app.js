const express = require('express')
const app = express()
const returnJSON = require('./returnJSON');
global.returnJSON = returnJSON
const router = require('./Routs')
app.use(express.json())
router(app)

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
})
app.use((req, res, next) => {
    next();
})
app.use((error, req, res, next) => {
    console.error('Error:', error);
    returnJSON(res, error.statusCode, 'error', error.message || 'Internal Server Error', null);
})
module.exports = app