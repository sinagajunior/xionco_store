const express = require('express');
const salesController = require('../controllers/salesController');

const router = express.Router();

router.get('/', salesController.getAllSales);
router.post('/', salesController.createSale);
router.get('/summary', salesController.getSalesSummary);
router.get('/:id', salesController.getSaleById);

module.exports = router;
