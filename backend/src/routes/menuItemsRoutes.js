const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuItemsController')

router.get('/menu_items', menuController.getMenuItems);
router.get('/an_vat', menuController.getAnVat);
router.get('/an_chinh', menuController.getAnChinh);
router.get('/do_uong', menuController.getDoUong);

module.exports = router;