const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuItemsController')

router.get('/tat_ca', menuController.getMenuItems);
router.get('/an_vat', menuController.getAnVat);
router.get('/an_chinh', menuController.getAnChinh);
router.get('/do_uong', menuController.getDoUong);
router.get('/search', menuController.searchMenuItems);
router.get('/', menuController.getMenuItemById);

module.exports = router;