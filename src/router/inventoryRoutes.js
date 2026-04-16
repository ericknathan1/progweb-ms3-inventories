const { Router } = require('express');
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Todas as rotas de estoque precisam de autenticação
router.use(authMiddleware);

router.post('/in', inventoryController.stockIn);
router.post('/out', inventoryController.stockOut);
router.get('/:productId/:warehouseId', inventoryController.getBalance);

module.exports = router;