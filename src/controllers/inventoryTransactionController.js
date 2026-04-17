const transactionService = require('../services/inventoryTransactionService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const {
  formatTransaction,
  formatTransactionsArray,
  formatStockBalance
} = require('../utils/formatterResponse');

const handleBusinessError = (error, res) => {
  if (error.message === MESSAGES.WAREHOUSE_NOT_FOUND || error.message === MESSAGES.TRANSACTION_NOT_FOUND) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
  }
  if (
    error.message === MESSAGES.INSUFFICIENT_STOCK ||
    error.message === MESSAGES.INVALID_QUANTITY ||
    error.message === MESSAGES.INVALID_ADJUSTMENT_DELTA ||
    error.message === MESSAGES.INVALID_TRANSACTION_TYPE
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
  }
  return null;
};

const stockIn = async (req, res, next) => {
  try {
    const { productId, warehouseId, quantity, reason } = req.body;
    const result = await transactionService.stockIn({ productId, warehouseId, quantity, reason });
    return res.status(HTTP_STATUS.CREATED).json({
      transaction: formatTransaction(result.transaction),
      balance: formatStockBalance(result.balance)
    });
  } catch (error) {
    const handled = handleBusinessError(error, res);
    if (handled) return handled;
    next(error);
  }
};

const stockOut = async (req, res, next) => {
  try {
    const { productId, warehouseId, quantity, reason } = req.body;
    const result = await transactionService.stockOut({ productId, warehouseId, quantity, reason });
    return res.status(HTTP_STATUS.CREATED).json({
      transaction: formatTransaction(result.transaction),
      balance: formatStockBalance(result.balance)
    });
  } catch (error) {
    const handled = handleBusinessError(error, res);
    if (handled) return handled;
    next(error);
  }
};

const adjustment = async (req, res, next) => {
  try {
    const { productId, warehouseId, delta, reason } = req.body;
    const result = await transactionService.adjustment({ productId, warehouseId, delta, reason });
    return res.status(HTTP_STATUS.CREATED).json({
      transaction: formatTransaction(result.transaction),
      balance: formatStockBalance(result.balance)
    });
  } catch (error) {
    const handled = handleBusinessError(error, res);
    if (handled) return handled;
    next(error);
  }
};

const listTransactions = async (req, res, next) => {
  try {
    const { productId, warehouseId, type, dateFrom, dateTo } = req.query;
    const transactions = await transactionService.listTransactions({
      productId,
      warehouseId,
      type,
      dateFrom,
      dateTo
    });
    return res.status(HTTP_STATUS.OK).json(formatTransactionsArray(transactions));
  } catch (error) {
    const handled = handleBusinessError(error, res);
    if (handled) return handled;
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await transactionService.getTransactionById(id);
    return res.status(HTTP_STATUS.OK).json(formatTransaction(transaction));
  } catch (error) {
    const handled = handleBusinessError(error, res);
    if (handled) return handled;
    next(error);
  }
};

module.exports = {
  stockIn,
  stockOut,
  adjustment,
  listTransactions,
  getTransactionById
};
