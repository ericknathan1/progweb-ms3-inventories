const stockBalanceRepo = require('../repositories/stockBalanceRepository');
const { MESSAGES } = require('../utils/constants');
const { ensureWarehouseExists } = require('../utils/validators');

const listStockBalances = async (filters = {}) => {
  const where = {};
  if (filters.productId !== undefined) where.product_id = Number(filters.productId);
  if (filters.warehouseId !== undefined) where.warehouse_id = Number(filters.warehouseId);
  return await stockBalanceRepo.findAll(where);
};

const getStockBalance = async (productId, warehouseId) => {
  const balance = await stockBalanceRepo.findByProductWarehouse(productId, warehouseId);
  if (!balance) throw new Error(MESSAGES.STOCK_BALANCE_NOT_FOUND);
  return balance;
};

const getLowStockBalances = async () => {
  return await stockBalanceRepo.findLowStock();
};

const updateMinStock = async (productId, warehouseId, minStock) => {
  if (minStock !== null && (!Number.isInteger(minStock) || minStock < 0)) {
    throw new Error(MESSAGES.INVALID_QUANTITY);
  }
  await ensureWarehouseExists(Number(warehouseId));
  const existing = await stockBalanceRepo.findByProductWarehouse(productId, warehouseId);
  if (!existing) throw new Error(MESSAGES.STOCK_BALANCE_NOT_FOUND);
  return await stockBalanceRepo.updateMinStock(productId, warehouseId, minStock);
};

module.exports = {
  listStockBalances,
  getStockBalance,
  getLowStockBalances,
  updateMinStock
};
