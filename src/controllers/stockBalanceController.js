const stockBalanceService = require('../services/stockBalanceService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { formatStockBalance, formatStockBalancesArray } = require('../utils/formatterResponse');

const listStockBalances = async (req, res, next) => {
  try {
    const { productId, warehouseId } = req.query;
    const balances = await stockBalanceService.listStockBalances({ productId, warehouseId });
    return res.status(HTTP_STATUS.OK).json(formatStockBalancesArray(balances));
  } catch (error) {
    next(error);
  }
};

const getLowStockBalances = async (req, res, next) => {
  try {
    const balances = await stockBalanceService.getLowStockBalances();
    return res.status(HTTP_STATUS.OK).json(formatStockBalancesArray(balances));
  } catch (error) {
    next(error);
  }
};

const getStockBalance = async (req, res, next) => {
  try {
    const { productId, warehouseId } = req.params;
    const balance = await stockBalanceService.getStockBalance(productId, warehouseId);
    return res.status(HTTP_STATUS.OK).json(formatStockBalance(balance));
  } catch (error) {
    if (error.message === MESSAGES.STOCK_BALANCE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const updateMinStock = async (req, res, next) => {
  try {
    const { productId, warehouseId } = req.params;
    const { minStock } = req.body;
    const updated = await stockBalanceService.updateMinStock(productId, warehouseId, minStock);
    return res.status(HTTP_STATUS.OK).json(formatStockBalance(updated));
  } catch (error) {
    if (error.message === MESSAGES.STOCK_BALANCE_NOT_FOUND || error.message === MESSAGES.WAREHOUSE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.INVALID_QUANTITY) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  listStockBalances,
  getLowStockBalances,
  getStockBalance,
  updateMinStock
};
