const { inspect } = require("util"),
	{ splitMessage } = require("discord.js"),
	{ Command } = require("discord.js-commando"),
	escapeRegex = require("escape-string-regexp");
const nlPattern = new RegExp("!!NL!!", "g");

module.exports = class Eval extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			group: "misc",
			memberName: "eval",
			description: "Executes JavaScript code.",
			details: "Only the bot owner(s) may use this command.",
			ownerOnly: true,
			args: [
				{
					key: "script",
					prompt: "Code to be evaluated",
					type: "string"
				}
			]
		});
		this.lastResult = null;
	}

	run(message, args) {
		if (message.content.includes("token") || message.content.includes("config") || message.content.includes("password"))
			return message.channel.send("Insecure code not allowed.");
		this.doReply = val => {
			if (val instanceof Error)
				return message.channel.send(`Callback error: \`${val}\``);
			else {
				const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
				return Array.isArray(result) ? result.map(item => message.channel.send(item)) : message.channel.send(result);
			}
		};

		let hrDiff;
		try {
			const hrStart = process.hrtime();
			this.lastResult = eval(args.script);
			hrDiff = process.hrtime(hrStart);
		} catch (err) {
			return message.channel.send(`Error while evaluating: \`${err}\``);
		}

		this.hrStart = process.hrtime();
		const result = this.makeResultMessages(this.lastResult, hrDiff, args.script);
		return Array.isArray(result) ? result.map(item => message.channel.send(item)) : message.channel.send(result);
	}

	makeResultMessages(result, hrDiff, input = null) {
		let inspected = inspect(result, { depth: 0 }).replace(nlPattern, "\n");
		for (const pattern of this.getSensitivePatterns())
			inspected = inspected.replace(pattern, "[CENSORED]");
		const split = inspected.split("\n");
		const lastInspected = inspected[inspected.length - 1];
		const prependPart = inspected[0] !== "{" && inspected[0] !== "[" && inspected[0] !== "'" ? split[0] : inspected[0];
		const appendPart = lastInspected !== "}" && lastInspected !== "]" && lastInspected !== "'" ? split[split.length - 1] : lastInspected;
		const prepend = ["```js", prependPart, ""].join("\n");
		const append = ["", appendPart, "```"].join("\n");
		if (input) {
			return splitMessage([
				`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.`,
				"```js",
				inspected,
				"```"
			].join("\n"), { maxLength: 1900, prepend, append });
		} else {
			return splitMessage([
				`Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.`,
				"```js",
				inspected,
				"```"
			].join("\n"), { maxLength: 1900, prepend, append });
		}
	}

	getSensitivePatterns() {
		if (!this._sensitivePattern || !Array.isArray(this._sensitivePattern)) {
			this._sensitivePattern = [];
			if (this.client.token)
				this._sensitivePattern.push(new RegExp(escapeRegex(this.client.token), "gi"));
		}
		return this._sensitivePattern;
	}
};