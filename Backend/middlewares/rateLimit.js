// Simple in-memory rate limiter (per IP)
// NOTE: This is a basic guard for development/staging. For production, use a Redis-backed limiter.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 200; // max requests per window per IP

const cache = new Map();

function rateLimit(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = cache.get(ip) || { count: 0, startsAt: now };

    if (now - entry.startsAt > WINDOW_MS) {
      entry.count = 1;
      entry.startsAt = now;
    } else {
      entry.count += 1;
    }

    cache.set(ip, entry);

    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.floor((entry.startsAt + WINDOW_MS) / 1000));

    if (entry.count > MAX_REQUESTS) {
      return res.status(429).json({ message: 'Too many requests - please try again later' });
    }

    next();
  } catch (err) {
    // Fail open on unexpected errors in the limiter
    next();
  }
}

module.exports = rateLimit;
