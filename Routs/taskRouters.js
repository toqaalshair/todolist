const express = require('express');
const router = express.Router();
const { task } = require('../Controllers');
router.post('/create', task.create);
router.put('/update/:id', task.update);
router.delete('/delete/:id', task.delete);
router.get('/getAll', task.getAll);
router.get('/getById/:id', task.getById);
router.get('/getByStatus/:status', task.getByStatus);
router.get('/getendOfNextDay', task.getendOfNextDay);

module.exports = router;