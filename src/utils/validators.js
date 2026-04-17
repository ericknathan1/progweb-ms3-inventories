const warehouseRepo = require('../repositories/warehouseRepository');
const stockBalanceRepo = require('../repositories/stockBalanceRepository');
const { MESSAGES } = require('./constants');

const ensureWarehouseExists = async (id) => {
  const warehouse = await warehouseRepo.findById(id);
  if (!warehouse) throw new Error(MESSAGES.WAREHOUSE_NOT_FOUND);
  return warehouse;
};

const ensureWarehouseNameUnique = async (name, excludeId = null) => {
  const existing = await warehouseRepo.findByName(name);
  if (existing && existing.id !== excludeId) {
    throw new Error(MESSAGES.WAREHOUSE_NAME_DUPLICATE);
  }
};

const ensureSufficientStock = async (productId, warehouseId, quantity) => {
  const balance = await stockBalanceRepo.findByProductWarehouse(productId, warehouseId);
  if (!balance || balance.quantity < quantity) {
    throw new Error(MESSAGES.INSUFFICIENT_STOCK);
  }
  return balance;
};

const ensurePositiveQuantity = (quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error(MESSAGES.INVALID_QUANTITY);
  }
};

const ensureNonZeroDelta = (delta) => {
  if (!Number.isInteger(delta) || delta === 0) {
    throw new Error(MESSAGES.INVALID_ADJUSTMENT_DELTA);
  }
};

module.exports = {
  ensureWarehouseExists,
  ensureWarehouseNameUnique,
  ensureSufficientStock,
  ensurePositiveQuantity,
  ensureNonZeroDelta
};
