const express = require('express');
const router = express.Router();
const { auth } = require('../Controllers');
router.post('/signup', auth.signup)
    .post('/login', auth.login)
module.exports = router;