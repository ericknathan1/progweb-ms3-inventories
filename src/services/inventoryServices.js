const inventoryRepository = require('../repositories/inventory.repository');

class InventoryService {
  async addStock(data) {
    const { product_id, warehouse_id, quantity, reason } = data;
    return await inventoryRepository.updateStock(product_id, warehouse_id, quantity, 'IN', reason || 'Entrada via API');
  }

  async removeStock(data) {
    const { product_id, warehouse_id, quantity, reason } = data;
    
    const balance = await inventoryRepository.getBalance(product_id, warehouse_id);
    if (!balance || balance.quantity < quantity) {
      throw new Error('Stock insuficiente para esta operação.');
    }

    return await inventoryRepository.updateStock(product_id, warehouse_id, quantity, 'OUT', reason || 'Saída via API');
  }

  async getProductStock(product_id, warehouse_id) {
    return await inventoryRepository.getBalance(product_id, warehouse_id);
  }
}

module.exports = new InventoryService();