const express = require('express');
const router = express.Router();
const habitController = require('../controller/habitController.js');

router.get('/habits/', habitController.getHabits);

router.post('/habits/', habitController.createHabit);

router.delete('/habits/:id', habitController.deleteHabit);

router.patch('/habits/:id/toggle', habitController.toggleCompletion);

router.get('/habits/monthly', habitController.getMonthlyData);
router.get('/habits/available-icons', habitController.getAvailableIcons);

module.exports = router;