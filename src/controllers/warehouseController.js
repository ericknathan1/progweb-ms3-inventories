const warehouseService = require('../services/warehouseService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { formatWarehouse, formatWarehousesArray } = require('../utils/formatterResponse');

const createWarehouse = async (req, res, next) => {
  try {
    const { name, location } = req.body;
    const created = await warehouseService.createWarehouse({ name, location });
    return res.status(HTTP_STATUS.CREATED).json(formatWarehouse(created));
  } catch (error) {
    if (error.message === MESSAGES.WAREHOUSE_NAME_DUPLICATE) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: error.message });
    }
    if (error.message === MESSAGES.REQUIRED_FIELD) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const getAllWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    return res.status(HTTP_STATUS.OK).json(formatWarehousesArray(warehouses));
  } catch (error) {
    next(error);
  }
};

const getWarehouseById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const warehouse = await warehouseService.getWarehouseById(id);
    return res.status(HTTP_STATUS.OK).json(formatWarehouse(warehouse));
  } catch (error) {
    if (error.message === MESSAGES.WAREHOUSE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const updateWarehouse = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, location } = req.body;
    const updated = await warehouseService.updateWarehouse(id, { name, location });
    return res.status(HTTP_STATUS.OK).json(formatWarehouse(updated));
  } catch (error) {
    if (error.message === MESSAGES.WAREHOUSE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.WAREHOUSE_NAME_DUPLICATE) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: error.message });
    }
    next(error);
  }
};

const deleteWarehouse = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await warehouseService.deleteWarehouse(id);
    return res.status(HTTP_STATUS.OK).json({ message: 'Armazém removido com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.WAREHOUSE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.WAREHOUSE_HAS_BALANCES) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
};
