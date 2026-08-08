const pool = require('../config/database');

const getStockLevels = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.product_id, p.name, p.sku, s.quantity, s.updated_at
      FROM stock s
      JOIN products p ON s.product_id = p.id
      ORDER BY p.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      `SELECT s.*, p.name FROM stock s
       JOIN products p ON s.product_id = p.id
       WHERE s.product_id = $1`,
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recordStockMovement = async (req, res) => {
  try {
    const { productId, movementType, quantity, notes } = req.body;

    if (!productId || !movementType || !quantity) {
      return res.status(400).json({ error: 'productId, movementType, and quantity are required' });
    }

    if (!['IN', 'OUT', 'ADJUSTMENT'].includes(movementType)) {
      return res.status(400).json({ error: 'Invalid movement type' });
    }

    // Record movement
    await pool.query(
      `INSERT INTO stock_movements (product_id, movement_type, quantity, notes)
       VALUES ($1, $2, $3, $4)`,
      [productId, movementType, quantity, notes]
    );

    // Update stock quantity
    const adjustedQuantity = movementType === 'IN' ? quantity : -quantity;
    const result = await pool.query(
      `UPDATE stock SET quantity = quantity + $1, updated_at = NOW()
       WHERE product_id = $2
       RETURNING *`,
      [adjustedQuantity, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product stock not found' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockMovements = async (req, res) => {
  try {
    const { productId } = req.query;

    let query = `
      SELECT sm.*, p.name FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
    `;
    const params = [];

    if (productId) {
      query += ' WHERE sm.product_id = $1';
      params.push(productId);
    }

    query += ' ORDER BY sm.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStockLevels,
  getStockByProductId,
  recordStockMovement,
  getStockMovements
};
