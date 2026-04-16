const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn']
});

const connectDatabase = async () => {
  await prisma.$connect();
};

module.exports = {
  prisma,
  connectDatabase
};
