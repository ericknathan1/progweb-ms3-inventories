const formatWarehouse = (warehouse) => {
  if (!warehouse) return warehouse;
  return {
    id: warehouse.id,
    name: warehouse.name,
    location: warehouse.location
  };
};

const formatWarehousesArray = (warehouses) => {
  if (!Array.isArray(warehouses)) return warehouses;
  return warehouses.map(formatWarehouse);
};

const formatStockBalance = (balance) => {
  if (!balance) return balance;
  return {
    id: balance.id,
    productId: balance.product_id,
    warehouseId: balance.warehouse_id,
    quantity: balance.quantity,
    minStock: balance.min_stock,
    updatedAt: balance.updated_at,
    warehouse: balance.warehouses ? formatWarehouse(balance.warehouses) : undefined
  };
};

const formatStockBalancesArray = (balances) => {
  if (!Array.isArray(balances)) return balances;
  return balances.map(formatStockBalance);
};

const formatTransaction = (transaction) => {
  if (!transaction) return transaction;
  return {
    id: transaction.id,
    productId: transaction.product_id,
    warehouseId: transaction.warehouse_id,
    type: transaction.type,
    quantity: transaction.quantity,
    reason: transaction.reason,
    createdAt: transaction.created_at,
    warehouse: transaction.warehouses ? formatWarehouse(transaction.warehouses) : undefined
  };
};

const formatTransactionsArray = (transactions) => {
  if (!Array.isArray(transactions)) return transactions;
  return transactions.map(formatTransaction);
};

module.exports = {
  formatWarehouse,
  formatWarehousesArray,
  formatStockBalance,
  formatStockBalancesArray,
  formatTransaction,
  formatTransactionsArray
};
