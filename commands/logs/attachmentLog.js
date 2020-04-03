const { TextChannel } = require("discord.js");
const { Command } = require("discord.js-commando");

module.exports = class AttachmentLog extends Command {
	constructor(client) {
		super(client, {
			name: "attachmentlog",
			description: "Enable or disable attachment logging in a particular channel.",
			group: "logs",
			memberName: "attachmentlog",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
			args: [
				{
					key: "enabled",
					prompt: "Whether to enable or disable attachment logging.",
					type: "string",
					oneOf: ["enable", "disable"]
				},
				{
					key: "channel",
					prompt: "Channel to log attachments in.",
					type: "channel",
					default: "none"
				}
			]
		});
	}

	async run(message, args) {
		let logChannel = message.guild.settings.get("attachmentLogChannel");
		if (args.enabled === "enable") {
			if (args.channel === "none") {
				if (!logChannel) return message.channel.send("Invalid attachment log channel specified.");
				if (this.client.channels.has(logChannel)) {
					const perms = this.client.channels.get(logChannel).permissionsFor(this.client.user);
					if (!perms || !perms.has(["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"])) {
						logChannel = message.guild.settings.set("attachmentLogChannel", null);
						return message.channel.send("Invalid permissions.");
					}
					return message.channel.send(`Attachment log channel successfully set to #${this.client.channels.get(logChannel).name}.`);
				}
			}
			else if ((args.channel instanceof TextChannel) && this.client.channels.has(args.channel.id)) {
				const perms = args.channel.permissionsFor(this.client.user);
				if (!perms || !perms.has(["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"])) {
					logChannel = message.guild.settings.set("attachmentLogChannel", null);
					return message.channel.send("Invalid permissions.");
				}
				await message.guild.settings.set("attachmentLogChannel", logChannel = args.channel.id);
				return message.channel.send(`Attachment log channel successfully set to #${this.client.channels.get(logChannel).name}.`);
			}
		}
		else if (args.enabled === "disable") {
			logChannel = message.guild.settings.set("attachmentLogChannel", null);
			return message.channel.send("Attachment log channel successfully disabled.");
		}
	}
};
