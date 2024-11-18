const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/add_order', orderController.addOrder);
router.get('/get_orders', orderController.getOrder);

module.exports = router;