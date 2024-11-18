const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/add_order', orderController.addOrder);

module.exports = router;