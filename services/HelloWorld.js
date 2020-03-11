const log = require("fancy-log");
const BaseService = require("../helpers/BaseService.js");

module.exports = class TimedEvent extends BaseService {
	constructor(client) {
		super(client, {
			name: "Timed Event Service",
			description: "Prints 'Hello from the other side.' in console every minute.",
			enabled: false
		});
	}

	everyMinute() {
		log("Hello from the other side.");
	}
};