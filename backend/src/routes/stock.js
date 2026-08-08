const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/', stockController.getStockLevels);
router.get('/product/:productId', stockController.getStockByProductId);
router.post('/movement', stockController.recordStockMovement);
router.get('/movements', stockController.getStockMovements);

module.exports = router;
