const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/inventory', inventoryRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

module.exports = app;