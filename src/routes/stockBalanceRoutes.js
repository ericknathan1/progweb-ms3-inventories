const express = require('express');
const router = express.Router();
const stockBalanceController = require('../controllers/stockBalanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware);

router.get('/low-stock', stockBalanceController.getLowStockBalances);
router.get('/', stockBalanceController.listStockBalances);
router.get('/:productId/:warehouseId', stockBalanceController.getStockBalance);
router.patch(
  '/:productId/:warehouseId/min-stock',
  roleMiddleware([ROLES.ADMIN]),
  stockBalanceController.updateMinStock
);

module.exports = router;
