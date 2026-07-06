const pino = require('pino');

const logger = pino({
	level: 'info',
	timestamp: pino.stdTimeFunctions.isoTime,
	formatters: {
		level(label) {
			return { level: label };
		},
		bindings(bindings) {
			return { service: 'Mira-app', ...bindings };
		}
	}
});

module.exports = logger;
