require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');

const app = express();

const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.get('/health', (req, res) => res.status(200).json({ status: 'UP', service: 'ecommerce-inventory' }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`InventoryService running on port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
