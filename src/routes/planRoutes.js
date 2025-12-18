const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

router.get('/', planController.getPlans);
router.get('/:id', planController.getPlanById);
router.post('/seed', planController.seedPlans);

module.exports = router;
