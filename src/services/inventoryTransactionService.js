const transactionRepo = require('../repositories/inventoryTransactionRepository');
const { MESSAGES, TRANSACTION_TYPE } = require('../utils/constants');
const {
  ensureWarehouseExists,
  ensureProductExists,
  ensureSufficientStock,
  ensurePositiveQuantity,
  ensureNonZeroDelta
} = require('../utils/validators');

const stockIn = async ({ productId, warehouseId, quantity, reason, token }) => {
  ensurePositiveQuantity(quantity);
  await ensureWarehouseExists(Number(warehouseId));
  await ensureProductExists(Number(productId), token);
  
  return await transactionRepo.applyMovement({
    productId: Number(productId),
    warehouseId: Number(warehouseId),
    quantity,
    type: TRANSACTION_TYPE.IN,
    reason
  });
};

const stockOut = async ({ productId, warehouseId, quantity, reason, token }) => {
  ensurePositiveQuantity(quantity);
  await ensureWarehouseExists(Number(warehouseId));
  await ensureProductExists(Number(productId), token);
  await ensureSufficientStock(Number(productId), Number(warehouseId), quantity);
  
  return await transactionRepo.applyMovement({
    productId: Number(productId),
    warehouseId: Number(warehouseId),
    quantity,
    type: TRANSACTION_TYPE.OUT,
    reason
  });
};

const adjustment = async ({ productId, warehouseId, delta, reason, token }) => {
  ensureNonZeroDelta(delta);
  await ensureWarehouseExists(Number(warehouseId));
  await ensureProductExists(Number(productId), token);
  
  try {
    return await transactionRepo.applyAdjustment({
      productId: Number(productId),
      warehouseId: Number(warehouseId),
      delta,
      reason
    });
  } catch (error) {
    if (error.code === 'INSUFFICIENT_STOCK_FOR_ADJUSTMENT') {
      throw new Error(MESSAGES.INSUFFICIENT_STOCK);
    }
    throw error;
  }
};

const listTransactions = async (filters = {}) => {
  const where = {};
  if (filters.productId !== undefined) where.product_id = Number(filters.productId);
  if (filters.warehouseId !== undefined) where.warehouse_id = Number(filters.warehouseId);
  if (filters.type !== undefined) {
    if (!Object.values(TRANSACTION_TYPE).includes(filters.type)) {
      throw new Error(MESSAGES.INVALID_TRANSACTION_TYPE);
    }
    where.type = filters.type;
  }
  if (filters.dateFrom || filters.dateTo) {
    where.created_at = {};
    if (filters.dateFrom) where.created_at.gte = new Date(filters.dateFrom);
    if (filters.dateTo) where.created_at.lte = new Date(filters.dateTo);
  }
  return await transactionRepo.findAll(where);
};

const getTransactionById = async (id) => {
  const transaction = await transactionRepo.findById(id);
  if (!transaction) throw new Error(MESSAGES.TRANSACTION_NOT_FOUND);
  return transaction;
};

module.exports = {
  stockIn,
  stockOut,
  adjustment,
  listTransactions,
  getTransactionById
};
