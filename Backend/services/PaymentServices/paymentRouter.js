const Redis = require('ioredis');
const NombaGateway = require('./nombaGateway');
const alertingService = require('./alertingService');
require('dotenv').config();

// Establish Redis client with graceful failure handling
let redisClient = null;
if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false
    });
    redisClient.on('error', (err) => {
      console.warn('[Redis Warning] Redis connection error, falling back to local memory cache for Circuit Breaker:', err.message);
    });
  } catch (err) {
    console.warn('[Redis Warning] Failed to initialize Redis, falling back to local memory:', err.message);
  }
}

// In-memory fallback cache for state tracking if Redis is offline
const memoryCache = {};

class CircuitBreaker {
  constructor(gatewayName) {
    this.name = gatewayName;
    this.failureThreshold = 5;
    this.cooldownMs = 30000; // 30 seconds cooldown
  }

  async getCache(key) {
    if (redisClient && redisClient.status === 'ready') {
      return await redisClient.get(key);
    }
    return memoryCache[key];
  }

  async setCache(key, value, expirySeconds = null) {
    if (redisClient && redisClient.status === 'ready') {
      if (expirySeconds) {
        await redisClient.set(key, value, 'EX', expirySeconds);
      } else {
        await redisClient.set(key, value);
      }
    } else {
      memoryCache[key] = value;
    }
  }

  async incrCache(key) {
    if (redisClient && redisClient.status === 'ready') {
      return await redisClient.incr(key);
    }
    const val = (parseInt(memoryCache[key], 10) || 0) + 1;
    memoryCache[key] = val.toString();
    return val;
  }

  async resetCache(key) {
    if (redisClient && redisClient.status === 'ready') {
      await redisClient.del(key);
    } else {
      delete memoryCache[key];
    }
  }

  async getState() {
    const state = await this.getCache(`cb:${this.name}:state`);
    return state || 'CLOSED'; // Default state is CLOSED (healthy)
  }

  async recordSuccess() {
    await this.resetCache(`cb:${this.name}:failures`);
    await this.setCache(`cb:${this.name}:state`, 'CLOSED');
  }

  async recordFailure() {
    const failures = await this.incrCache(`cb:${this.name}:failures`);
    console.warn(`[Circuit Breaker] Gateway ${this.name} recorded failure count: ${failures}`);

    if (failures >= this.failureThreshold) {
      console.error(`[Circuit Breaker] Gateway ${this.name} failure threshold reached! Tripping circuit to OPEN.`);
      await this.setCache(`cb:${this.name}:state`, 'OPEN', Math.round(this.cooldownMs / 1000));
      await this.setCache(`cb:${this.name}:tripped_at`, Date.now().toString(), Math.round(this.cooldownMs / 1000));
      // Trigger async alert
      alertingService.sendCircuitBreakerTrippedAlert(this.name).catch(err => {
        console.error('Failed to send circuit breaker alert:', err.message);
      });
    }
  }

  async checkAvailability() {
    const state = await this.getState();
    if (state === 'OPEN') {
      const trippedAt = await this.getCache(`cb:${this.name}:tripped_at`);
      if (trippedAt && Date.now() - parseInt(trippedAt, 10) > this.cooldownMs) {
        console.log(`[Circuit Breaker] Gateway ${this.name} cooldown expired. Transitioning to HALF-OPEN.`);
        await this.setCache(`cb:${this.name}:state`, 'HALF_OPEN');
        return true;
      }
      return false; // Circuit is OPEN and cooling down
    }
    return true; // CLOSED or HALF_OPEN are allowed
  }
}

class PaymentRouter {
  constructor() {
    this.gateways = {
      nomba: new NombaGateway()
    };
    
    this.breakers = {
      nomba: new CircuitBreaker('nomba')
    };

    // Default priority routing order (can be configured via DB in future sprints)
    this.defaultPriorityList = ['nomba'];
  }

  /**
   * Resolves the first healthy gateway, falling back to next available if tripped.
   * @returns {Promise<{name: string, instance: IPaymentGateway}>}
   */
  async getHealthyGateway() {
    for (const name of this.defaultPriorityList) {
      const breaker = this.breakers[name];
      const isAvailable = await breaker.checkAvailability();
      if (isAvailable) {
        return { name, instance: this.gateways[name] };
      }
      console.warn(`[Router] Skipping ${name} because the circuit breaker is OPEN.`);
    }
    throw new Error('All payment gateways are currently offline. Please try again later.');
  }

  /**
   * Tracks execution health of a payment gateway call
   * @param {string} gatewayName - Gateway name
   * @param {Function} apiCall - Promise function wrapping gateway API request
   */
  async execute(gatewayName, apiCall) {
    const breaker = this.breakers[gatewayName];
    try {
      const result = await apiCall();
      await breaker.recordSuccess();
      return result;
    } catch (error) {
      await breaker.recordFailure();
      throw error;
    }
  }
}

const routerInstance = new PaymentRouter();

module.exports = {
  PaymentRouter: routerInstance,
  CircuitBreaker
};
