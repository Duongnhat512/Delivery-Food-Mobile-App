const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

router.get('/get_by_user_not_delivered', orderDetailController.getOrderDetailsChuaGiaoTheoCustomer);
router.get('/get_by_user_delivered', orderDetailController.getOrderDetailsDaGiaoTheoCustomer);
router.get('/get_by_user_delivering', orderDetailController.getOrderDetailsDangGiaoTheoCustomer);
router.put('/update_status', orderDetailController.updateStatusOrderDetail);
router.get('/get_huy_by_user', orderDetailController.getOrderDetailsDaHuyTheoCustomer);

module.exports = router;
