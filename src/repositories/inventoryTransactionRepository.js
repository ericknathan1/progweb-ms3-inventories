const prisma = require('../config/prisma');

const findById = async (id) => {
  return await prisma.inventory_transactions.findUnique({
    where: { id },
    include: { warehouses: true }
  });
};

const findAll = async (where = {}) => {
  return await prisma.inventory_transactions.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: { warehouses: true }
  });
};

const applyMovement = async ({ productId, warehouseId, quantity, type, reason }) => {
  return await prisma.$transaction(async (tx) => {
    const balance = await tx.stock_balances.upsert({
      where: {
        idx_product_warehouse: { product_id: productId, warehouse_id: warehouseId }
      },
      update: {
        quantity: type === 'IN' ? { increment: quantity } : { decrement: quantity },
        updated_at: new Date()
      },
      create: {
        product_id: productId,
        warehouse_id: warehouseId,
        quantity: type === 'IN' ? quantity : 0
      }
    });

    const transaction = await tx.inventory_transactions.create({
      data: {
        product_id: productId,
        warehouse_id: warehouseId,
        type,
        quantity,
        reason: reason || null
      },
      include: { warehouses: true }
    });

    return { balance, transaction };
  });
};

const applyAdjustment = async ({ productId, warehouseId, delta, reason }) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.stock_balances.findUnique({
      where: {
        idx_product_warehouse: { product_id: productId, warehouse_id: warehouseId }
      }
    });

    const currentQuantity = existing ? existing.quantity : 0;
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 0) {
      const err = new Error('INSUFFICIENT_STOCK_FOR_ADJUSTMENT');
      err.code = 'INSUFFICIENT_STOCK_FOR_ADJUSTMENT';
      throw err;
    }

    const balance = await tx.stock_balances.upsert({
      where: {
        idx_product_warehouse: { product_id: productId, warehouse_id: warehouseId }
      },
      update: { quantity: newQuantity, updated_at: new Date() },
      create: {
        product_id: productId,
        warehouse_id: warehouseId,
        quantity: newQuantity
      }
    });

    const transaction = await tx.inventory_transactions.create({
      data: {
        product_id: productId,
        warehouse_id: warehouseId,
        type: 'ADJUSTMENT',
        quantity: Math.abs(delta),
        reason: reason || null
      },
      include: { warehouses: true }
    });

    return { balance, transaction };
  });
};

module.exports = {
  findById,
  findAll,
  applyMovement,
  applyAdjustment
};
