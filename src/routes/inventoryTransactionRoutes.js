const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/inventoryTransactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware);

router.get('/', transactionController.listTransactions);
router.get('/:id', transactionController.getTransactionById);
router.post('/in', transactionController.stockIn);
router.post('/out', transactionController.stockOut);
router.post('/adjustment', roleMiddleware([ROLES.ADMIN]), transactionController.adjustment);

module.exports = router;
