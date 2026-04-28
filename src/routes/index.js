const express = require('express');
const warehouseRoutes = require('./warehouseRoutes');
const stockBalanceRoutes = require('./stockBalanceRoutes');
const inventoryTransactionRoutes = require('./inventoryTransactionRoutes');

const router = express.Router();

router.use('/warehouses', warehouseRoutes);
router.use('/stock-balances', stockBalanceRoutes);
router.use('/transactions', inventoryTransactionRoutes);

module.exports = router;
