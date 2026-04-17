const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware);

router.get('/', warehouseController.getAllWarehouses);
router.get('/:id', warehouseController.getWarehouseById);
router.post('/', roleMiddleware([ROLES.ADMIN]), warehouseController.createWarehouse);
router.put('/:id', roleMiddleware([ROLES.ADMIN]), warehouseController.updateWarehouse);
router.delete('/:id', roleMiddleware([ROLES.ADMIN]), warehouseController.deleteWarehouse);

module.exports = router;
