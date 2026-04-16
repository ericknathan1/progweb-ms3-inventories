const inventoryService = require('../services/inventory.service');

class InventoryController {
  async stockIn(req, res) {
    try {
      const result = await inventoryService.addStock(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async stockOut(req, res) {
    try {
      const result = await inventoryService.removeStock(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getBalance(req, res) {
    try {
      const { productId, warehouseId } = req.params;
      const result = await inventoryService.getProductStock(productId, warehouseId);
      return res.status(200).json(result || { quantity: 0 });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new InventoryController();