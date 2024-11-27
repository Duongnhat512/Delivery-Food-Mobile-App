const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/add_order', orderController.addOrder);
router.get('/get_orders', orderController.getOrder);
router.put('/update_status/:order_id/:item_id', orderController.updateStatusOrderDetail);

module.exports = router;