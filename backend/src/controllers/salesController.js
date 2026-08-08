const pool = require('../config/database');

const getAllSales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.quantity, s.unit_price, s.total_price, s.sale_date,
             p.id as product_id, p.name, p.sku
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.*, p.name, p.sku FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const { productId, quantity, unitPrice } = req.body;

    if (!productId || !quantity || !unitPrice) {
      return res.status(400).json({ error: 'productId, quantity, and unitPrice are required' });
    }

    const totalPrice = quantity * unitPrice;

    // Check product exists and has enough stock
    const stockResult = await pool.query(
      'SELECT quantity FROM stock WHERE product_id = $1',
      [productId]
    );

    if (stockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (stockResult.rows[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Record sale
    const saleResult = await pool.query(
      `INSERT INTO sales (product_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, quantity, unitPrice, totalPrice]
    );

    // Update stock
    await pool.query(
      'UPDATE stock SET quantity = quantity - $1, updated_at = NOW() WHERE product_id = $2',
      [quantity, productId]
    );

    // Record stock movement
    await pool.query(
      `INSERT INTO stock_movements (product_id, movement_type, quantity, notes)
       VALUES ($1, $2, $3, $4)`,
      [productId, 'OUT', quantity, `Sale #${saleResult.rows[0].id}`]
    );

    res.status(201).json(saleResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_sales,
        SUM(quantity) as total_units_sold,
        SUM(total_price) as total_revenue
      FROM sales
    `);

    const summary = result.rows[0];
    res.json({
      totalSales: parseInt(summary.total_sales),
      totalUnitsSold: parseInt(summary.total_units_sold) || 0,
      totalRevenue: parseFloat(summary.total_revenue) || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  getSalesSummary
};
