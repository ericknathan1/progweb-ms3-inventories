const warehouseRepo = require('../repositories/warehouseRepository');
const stockBalanceRepo = require('../repositories/stockBalanceRepository');
const { MESSAGES } = require('./constants');
const { productsApi } = require('./http');

const ensureWarehouseExists = async (id) => {
  const warehouse = await warehouseRepo.findById(id);
  if (!warehouse) throw new Error(MESSAGES.WAREHOUSE_NOT_FOUND);
  return warehouse;
};

/**
 * Valida se o produto existe no Microsserviço de Produtos (MS2) via HTTP.
 */
const ensureProductExists = async (productId, token) => {
  try {
    await productsApi.get(`/products/${productId}`, {
      headers: { Authorization: token }
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Produto ${productId} não encontrado no catálogo.`);
    }
    throw new Error(`Falha ao validar produto no serviço de produtos: ${error.message}`);
  }
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
  ensureProductExists,
  ensureWarehouseNameUnique,
  ensureSufficientStock,
  ensurePositiveQuantity,
  ensureNonZeroDelta
};
