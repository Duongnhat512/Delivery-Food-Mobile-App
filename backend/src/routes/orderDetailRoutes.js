const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

router.get('/get_by_user_and_status', orderDetailController.getOrderDetailsTheoCustomerVaStatus);
router.put('/update_status', orderDetailController.updateStatusOrderDetail);

module.exports = router;
