const axios = require('axios');

// Instância para o Microsserviço de Produtos
const productsApi = axios.create({
  baseURL: process.env.PRODUCTS_SERVICE_URL,
});

module.exports = {
  productsApi,
};
