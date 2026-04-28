const warehouseRepo = require('../repositories/warehouseRepository');
const { MESSAGES } = require('../utils/constants');
const { ensureWarehouseExists, ensureWarehouseNameUnique } = require('../utils/validators');

const createWarehouse = async ({ name, location }) => {
  if (!name || !location) {
    throw new Error(MESSAGES.REQUIRED_FIELD);
  }
  await ensureWarehouseNameUnique(name);
  return await warehouseRepo.create({ name, location });
};

const getAllWarehouses = async () => {
  return await warehouseRepo.findAll();
};

const getWarehouseById = async (id) => {
  return await ensureWarehouseExists(id);
};

const updateWarehouse = async (id, { name, location }) => {
  await ensureWarehouseExists(id);
  const data = {};
  if (name !== undefined) {
    await ensureWarehouseNameUnique(name, id);
    data.name = name;
  }
  if (location !== undefined) data.location = location;
  return await warehouseRepo.update(id, data);
};

const deleteWarehouse = async (id) => {
  await ensureWarehouseExists(id);
  const balanceCount = await warehouseRepo.countBalances(id);
  if (balanceCount > 0) {
    throw new Error(MESSAGES.WAREHOUSE_HAS_BALANCES);
  }
  return await warehouseRepo.remove(id);
};

module.exports = {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
};
