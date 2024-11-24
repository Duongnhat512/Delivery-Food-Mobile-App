const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/sign_up', userController.signUp);
router.get('/get_user', userController.getUser);
router.put('/update_address', userController.updateAddress);
router.put('/update_user', userController.updateUser);

module.exports = router;