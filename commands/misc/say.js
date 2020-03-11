const { Command } = require("discord.js-commando");
const { TextChannel } = require("discord.js");

module.exports = class Say extends Command {
	constructor(client) {
		super(client, {
			name: "say",
			memberName: "say",
			group: "misc",
			description: "Make the bot say something.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "channel",
					prompt: "Channel to send the message in.",
					type: "channel"
				},
				{
					key: "message",
					prompt: "Message to be sent in that channel.",
					type: "string",
					validate: v => v.length > 0
				}
			]
		});
	}

	async run(message, args) {
		if (args.channel.type !== "text" && args.channel.type !== "news")
			return message.channel.send({ embed: { description: "Invalid channel specified." } });
		return args.channel.send(args.message);
	}
};