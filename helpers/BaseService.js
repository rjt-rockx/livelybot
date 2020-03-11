module.exports = class BaseService {
	constructor(client, serviceInfo) {
		this.client = client;
		this._name = serviceInfo.name ? serviceInfo.name : this.constructor.name;
		this._description = serviceInfo.description ? serviceInfo.description : "No description specified.";
		this.enabled = typeof serviceInfo.enabled === "boolean" ? serviceInfo.enabled : true;
	}

	get id() {
		return this.constructor.name;
	}

	get name() {
		return this._name;
	}

	get description() {
		return this._description;
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}
};