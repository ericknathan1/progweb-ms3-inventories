const prisma = require('../config/prisma');

const findByProductWarehouse = async (productId, warehouseId) => {
  return await prisma.stock_balances.findUnique({
    where: {
      idx_product_warehouse: {
        product_id: Number(productId),
        warehouse_id: Number(warehouseId)
      }
    },
    include: { warehouses: true }
  });
};

const findAll = async (where = {}) => {
  return await prisma.stock_balances.findMany({
    where,
    orderBy: [{ warehouse_id: 'asc' }, { product_id: 'asc' }],
    include: { warehouses: true }
  });
};

const findLowStock = async () => {
  const balances = await prisma.stock_balances.findMany({
    where: { min_stock: { not: null } },
    orderBy: [{ warehouse_id: 'asc' }, { product_id: 'asc' }],
    include: { warehouses: true }
  });
  return balances.filter((b) => b.min_stock !== null && b.quantity < b.min_stock);
};

const updateMinStock = async (productId, warehouseId, minStock) => {
  return await prisma.stock_balances.update({
    where: {
      idx_product_warehouse: {
        product_id: Number(productId),
        warehouse_id: Number(warehouseId)
      }
    },
    data: { min_stock: minStock },
    include: { warehouses: true }
  });
};

module.exports = {
  findByProductWarehouse,
  findAll,
  findLowStock,
  updateMinStock
};
