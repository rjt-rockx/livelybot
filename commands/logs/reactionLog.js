const { TextChannel } = require("discord.js");
const { Command } = require("discord.js-commando");

module.exports = class ReactionLog extends Command {
	constructor(client) {
		super(client, {
			name: "reactionlog",
			description: "Enable or disable reaction logging in a particular channel.",
			group: "logs",
			memberName: "reactionlog",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			args: [
				{
					key: "enabled",
					prompt: "Whether to enable or disable reaction logging.",
					type: "string",
					oneOf: ["enable", "disable"]
				},
				{
					key: "channel",
					prompt: "Channel to log reactions in.",
					type: "channel",
					default: "none"
				}
			]
		});
	}

	async run(message, args) {
		let logChannel = message.guild.settings.get("reactionLogChannel");
		if (args.enabled === "enable") {
			if (args.channel === "none") {
				if (!logChannel) return message.channel.send("Invalid reaction log channel specified.");
				if (this.client.channels.has(logChannel)) {
					const perms = this.client.channels.get(logChannel).permissionsFor(this.client.user);
					if (!perms || !perms.has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"])) {
						logChannel = message.guild.settings.set("reactionLogChannel", null);
						return message.channel.send("Invalid permissions.");
					}
					return message.channel.send(`Reaction log channel successfully set to #${this.client.channels.get(logChannel).name}.`);
				}
			}
			else if ((args.channel instanceof TextChannel) && this.client.channels.has(args.channel.id)) {
				const perms = args.channel.permissionsFor(this.client.user);
				if (!perms || !perms.has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"])) {
					logChannel = message.guild.settings.set("reactionLogChannel", null);
					return message.channel.send("Invalid permissions.");
				}
				await message.guild.settings.set("reactionLogChannel", logChannel = args.channel.id);
				return message.channel.send(`Reaction log channel successfully set to #${this.client.channels.get(logChannel).name}.`);
			}
		}
		else if (args.enabled === "disable") {
			logChannel = message.guild.settings.set("reactionLogChannel", null);
			return message.channel.send("Reaction log channel successfully disabled.");
		}
	}
};
