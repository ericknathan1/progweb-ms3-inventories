const prisma = require('../config/prisma');

class InventoryRepository {
  async getBalance(product_id, warehouse_id) {
    return await prisma.stock_balances.findUnique({
      where: {
        idx_product_warehouse: {
          product_id: Number(product_id),
          warehouse_id: Number(warehouse_id)
        }
      }
    });
  }

  async updateStock(product_id, warehouse_id, quantity, type, reason) {
    return await prisma.$transaction(async (tx) => {
      // 1. Atualizar ou Criar o Saldo
      const balance = await tx.stock_balances.upsert({
        where: { idx_product_warehouse: { product_id, warehouse_id } },
        update: {
          quantity: type === 'IN' ? { increment: quantity } : { decrement: quantity },
          updated_at: new Date()
        },
        create: {
          product_id,
          warehouse_id,
          quantity: type === 'IN' ? quantity : 0
        }
      });

      // 2. Criar a Transação de Histórico
      await tx.inventory_transactions.create({
        data: { product_id, warehouse_id, type, quantity, reason }
      });

      return balance;
    });
  }
}

module.exports = new InventoryRepository();