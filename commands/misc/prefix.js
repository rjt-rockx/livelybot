const { Command } = require("discord.js-commando");

module.exports = class Prefix extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			memberName: "prefix",
			group: "misc",
			description: "Get or set the prefix for this guild.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "prefix",
					prompt: "New prefix to set, if any.",
					type: "string",
					default: ""
				}
			]
		});
	}

	async run(message, args) {
		if (!args.prefix)
			return message.channel.send({ embed: { title: "Guild prefix", description: `Command prefix for this guild is currently set to \`${message.guild.commandPrefix || this.client.commandPrefix}\`` } });
		message.guild.commandPrefix = args.prefix;
		message.guild.settings.set("prefix", message.guild.commandPrefix);
		return message.channel.send({ embed: { title: "Guild prefix", description: `Command prefix for this guild successfully set to \`${message.guild.commandPrefix || this.client.commandPrefix}\`` } });
	}
};