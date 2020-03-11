const { Command } = require("discord.js-commando");
const { Util: { escapeMarkdown } } = require("discord.js");
const FieldPaginator = require("../../helpers/FieldPaginator.js");
const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			memberName: "help",
			group: "misc",
			description: "Get help for a specific command or for all commands.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "command",
					prompt: "Command to get help for.",
					type: "command",
					default: "all"
				}
			]
		});
	}

	async run(message, args) {
		if (args.command === "all") {
			const commands = this.client.registry.commands.array().sort((a, b) => a.name.localeCompare(b.name)).map(command => {
				const commandData = getCommandData(command, this.client, message.guild.commandPrefix || this.client.commandPrefix);
				return { name: commandData.name, value: commandData.description };
			});
			new FieldPaginator(message.channel, message.author, commands, 15, {
				embedTemplate: { title: "List of commands:" }
			});
			return;
		}
		const commandData = getCommandData(args.command, this.client, message.guild.commandPrefix || this.client.commandPrefix);
		const fields = [];
		if (commandData.aliases)
			fields.push({ name: "Aliases", value: commandData.aliases });
		if (commandData.commandArgs)
			fields.push({ name: "Arguments", value: commandData.commandArgs });
		if (commandData.userperms)
			fields.push({ name: "Required User Permissions", value: commandData.userperms });
		if (commandData.clientperms)
			fields.push({ name: "Required Bot Permissions", value: commandData.clientperms });
		message.channel.send({ embed: { title: commandData.name, description: commandData.description, fields } });
	}
};

function getCommandData(command, client, prefixToUse) {
	let commandTitle = escapeMarkdown(prefixToUse + command.name), commandArgs = "";
	if (command.argsCollector && command.argsCollector.args && Array.isArray(command.argsCollector.args)) {
		const argKeys = command.argsCollector.args.map(arg => {
			const argName = (arg.oneOf && arg.oneOf.length < 4) ? arg.oneOf.join("/") : arg.key;
			return `${typeof arg.default !== "undefined" && arg.default !== null ? `[${argName}]` : `<${argName}>`}`;
		});
		commandTitle += ` ${argKeys.join(" ")}`;
		if (command.argsCollector.args.length > 0)
			commandArgs = command.argsCollector.args.map(arg => `**${toTitleCase(arg.key)}** - ${arg.prompt} ${typeof arg.default !== "undefined" && arg.default !== null ? `(Default: ${typeof arg.default === "string" && arg.default.length ? arg.default : "nothing"})` : ""}`).join("\n");
	}
	let userperms = "";
	if (Array.isArray(command.userPermissions) && command.userPermissions.length > 0)
		userperms = command.userPermissions.map(permission => toTitleCase(permission.split("_").join(" ").toLowerCase())).join(", ");
	let clientperms = "";
	if (Array.isArray(command.clientPermissions) && command.clientPermissions.length > 0)
		clientperms = command.clientPermissions.map(permission => toTitleCase(permission.split("_").join(" ").toLowerCase())).join(", ");
	return {
		name: commandTitle,
		aliases: Array.isArray(command.aliases) ? command.aliases.map(alias => escapeMarkdown(prefixToUse + alias)).join(", ") : "",
		description: command.description,
		commandArgs, userperms, clientperms
	};
}