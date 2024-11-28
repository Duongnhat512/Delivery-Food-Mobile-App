const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/add_order', orderController.addOrder);
router.get('/get_orders', orderController.getOrder);
router.put('/update_status/:order_id/:item_id', orderController.updateStatusOrderDetail);
router.put('/update_quantity_and_total/:order_id/:item_id', orderController.updateQuantityAndTotalOrderDetail);
router.delete('/delete_order_detail/:order_id/:item_id', orderController.deleteOrderDetail);
router.put('/update_only_status/:order_id/:item_id', orderController.updateOnLyStatus);
module.exports = router;