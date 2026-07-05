const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
});

const withdrawalQueue = new Queue('withdrawal-queue', { connection });

const addWithdrawalJob = async (withdrawalData) => {
  return await withdrawalQueue.add(`withdrawal-${withdrawalData.reference}`, withdrawalData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
  });
};

module.exports = {
  withdrawalQueue,
  addWithdrawalJob,
  connection,
};
