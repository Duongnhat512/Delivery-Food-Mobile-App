const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/sign_up', userController.signUp);
router.get('/get_user', userController.getUser);

module.exports = router;