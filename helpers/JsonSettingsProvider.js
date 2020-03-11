const { SettingProvider } = require("discord.js-commando");
const File = require("./File.js");

module.exports = class JSONSettingsProvider extends SettingProvider {
	constructor(path) {
		super();
		this.file = new File(path);
		if (!this.file.exists) this.file.write({}, false, true);
	}

	init(client) {
		const data = this.file.read();
		for (const [id] of client.guilds) {
			if (!data[id]) data[id] = {};
			if (data[id].prefix && client.guilds.has(id))
				client.guilds.get(id).commandPrefix = data[id].prefix;
		}
		this.file.write(data);
	}

	get(guild, key, defaultValue) {
		let returnValue = undefined;
		if (typeof key === "undefined")
			return returnValue;
		const data = this.file.read();
		const id = SettingProvider.getGuildID(guild);
		if (typeof data[id] === "undefined")
			data[id] = {};
		if (typeof data[id][key] !== "undefined")
			returnValue = data[id][key];
		if (typeof returnValue === "undefined" && typeof defaultValue !== "undefined") {
			returnValue = defaultValue;
			data[id][key] = defaultValue;
		}
		this.file.write(data);
		return returnValue;
	}

	set(guild, key, value) {
		if (typeof key === "undefined")
			throw new Error("No key specified.");
		if (typeof value === "undefined")
			throw new Error("No value specified.");
		const data = this.file.read();
		const id = SettingProvider.getGuildID(guild);
		if (typeof data[id] === "undefined")
			data[id] = {};
		data[id][key] = value;
		this.file.write(data);
		return value;
	}

	remove(guild, key) {
		if (typeof key === "undefined")
			throw new Error("No key specified.");
		const data = this.file.read();
		const id = SettingProvider.getGuildID(guild);
		if (typeof data[id] === "undefined")
			data[id] = {};
		const value = data[id][key];
		delete data[id][key];
		this.file.write(data);
		return value;
	}

	clear(guild) {
		const data = this.file.read();
		const id = SettingProvider.getGuildID(guild);
		delete data[id];
		this.file.write(data);
	}

	destroy() { }
};