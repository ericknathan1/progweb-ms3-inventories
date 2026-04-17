const prisma = require('../config/prisma');

const findById = async (id) => {
  return await prisma.warehouses.findUnique({
    where: { id }
  });
};

const findByName = async (name) => {
  return await prisma.warehouses.findFirst({
    where: { name }
  });
};

const findAll = async () => {
  return await prisma.warehouses.findMany({
    orderBy: { id: 'asc' }
  });
};

const create = async (data) => {
  return await prisma.warehouses.create({ data });
};

const update = async (id, data) => {
  return await prisma.warehouses.update({
    where: { id },
    data
  });
};

const remove = async (id) => {
  return await prisma.warehouses.delete({
    where: { id }
  });
};

const countBalances = async (id) => {
  return await prisma.stock_balances.count({
    where: { warehouse_id: id }
  });
};

module.exports = {
  findById,
  findByName,
  findAll,
  create,
  update,
  remove,
  countBalances
};
