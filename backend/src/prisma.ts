import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Test database connection on startup
prisma.$connect()
    .then(() => {
        console.log('[database]: Connected to database successfully');
    })
    .catch((error) => {
        console.error('[database]: Failed to connect to database:', error);
    });

export default prisma;
