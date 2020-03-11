const { Command } = require("discord.js-commando");

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			memberName: "ping",
			group: "misc",
			description: "Get the ping of the bot.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
		});
	}

	async run(message) {
		const pingMsg = await message.channel.send({ embed: { description: "Pinging ..." } });
		return pingMsg.edit({
			embed: {
				fields: [
					{ name: "Message Ping", value: `${Math.round(pingMsg.createdTimestamp - message.createdTimestamp)}ms`, inline: true },
					{ name: "Websocket Ping", value: `${Math.round(this.client.ping)}ms`, inline: true }
				]
			}
		});
	}
};