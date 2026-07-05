const pino = require('pino');

const logger = pino({
	level: 'info',
	timestamp: pino.stdTimeFunctions.isoTime,
	formatters: {
		level(label) {
			return { level: label };
		},
		bindings(bindings) {
			return { service: 'kwestpay-app', ...bindings };
		}
	}
});

module.exports = logger;
