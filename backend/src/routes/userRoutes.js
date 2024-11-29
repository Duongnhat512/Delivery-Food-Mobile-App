const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/sign_up', userController.signUp);
router.get('/get_user', userController.getUser);
router.post('/update_address', userController.updateAddress);
router.put('/update_user', userController.updateUser);
router.post('/addPayment', userController.addPayment);
router.delete('/get_user/:id', userController.deleteAddress);
router.post('/add_cart', userController.addCart);
router.delete('/clear_cart', userController.clearCart);
router.delete('/delete_cart_item/:item_id', userController.deleteCartItem);

module.exports = router;