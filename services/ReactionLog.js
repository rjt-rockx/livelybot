const { RichEmbed } = require("discord.js");
const BaseService = require("../helpers/BaseService.js");

module.exports = class ReactionLog extends BaseService {
	constructor(client) {
		super(client, {
			name: "Reaction Log Service",
			description: "Logs reactions added to messages.",
			enabled: true
		});
	}

	async onMessageReactionAdd(ctx) {
		if (!ctx || ctx.user.bot || !ctx.user || !ctx.reaction || ctx.reaction.message.author.bot) return;
		const logChannel = ctx.guild.settings.get("reactionLogChannel");
		const url = getUrl(ctx.reaction.emoji);
		if (this.client.channels.has(logChannel)) {
			this.client.channels.get(logChannel).send(new RichEmbed({
				author: {
					icon_url: ctx.user.displayAvatarURL,
					name: `${ctx.user.tag} reacted in #${ctx.reaction.message.channel.name}`
				},
				thumbnail: { url },
				title: "Message",
				description: ctx.reaction.message.content || "[Embed]",
				fields: [
					{
						name: "Emoji",
						value: [
							ctx.reaction.emoji.id ? `:${ctx.reaction.emoji.name}:` : ctx.reaction.emoji.name,
							ctx.reaction.emoji.id ? `(${ctx.reaction.emoji.id})` : "",
							`| [[Link]](${url})`
						].join(" "),
						inline: false
					},
					{
						name: "User ID",
						value: ctx.user.id,
						inline: true
					},
					{
						name: "Message ID",
						value: `${ctx.reaction.message.id} | [[Link]](https://discordapp.com/channels/${ctx.guild.id}/${ctx.channel.id}/${ctx.message.id})`,
						inline: true
					}
				],
				footer: {
					icon_url: ctx.reaction.message.author.displayAvatarURL,
					text: `${ctx.reaction.message.author.tag} in #${ctx.reaction.message.channel.name}`
				},
				timestamp: ctx.reaction.message.createdTimestamp
			}));
		}
	}

	async onMessageReactionRemove(ctx) {
		if (!ctx || !ctx.user || ctx.user.bot || !ctx.reaction || ctx.reaction.message.author.bot) return;
		const logChannel = ctx.guild.settings.get("reactionLogChannel");
		const url = getUrl(ctx.reaction.emoji);
		if (this.client.channels.has(logChannel)) {
			this.client.channels.get(logChannel).send(new RichEmbed({
				author: {
					icon_url: ctx.user.displayAvatarURL,
					name: `${ctx.user.tag}'s reaction was removed in #${ctx.reaction.message.channel.name}`
				},
				thumbnail: { url },
				description: ctx.reaction.message.content || "[Embed]",
				fields: [
					{
						name: "Emoji",
						value: [
							ctx.reaction.emoji.id ? `:${ctx.reaction.emoji.name}:` : ctx.reaction.emoji.name,
							ctx.reaction.emoji.id ? `(${ctx.reaction.emoji.id})` : "",
							`| [[Link]](${url})`
						].join(" "),
						inline: false
					},
					{
						name: "User ID",
						value: ctx.user.id,
						inline: true
					},
					{
						name: "Message ID",
						value: `${ctx.reaction.message.id} | [[Link]](https://discordapp.com/channels/${ctx.guild.id}/${ctx.channel.id}/${ctx.message.id})`,
						inline: true
					}
				],
				footer: {
					icon_url: ctx.reaction.message.author.displayAvatarURL,
					text: `${ctx.reaction.message.author.tag} in #${ctx.reaction.message.channel.name}`
				}, timestamp: ctx.reaction.message.createdTimestamp
			}));
		}
	}

	async onMessageReactionRemoveEmoji(ctx) {
		if (!ctx || !ctx.reaction || ctx.reaction.message.author.bot) return;
		const logChannel = ctx.guild.settings.get("reactionLogChannel");
		const url = getUrl(ctx.reaction.emoji);
		if (this.client.channels.has(logChannel)) {
			this.client.channels.get(logChannel).send(new RichEmbed({
				author: {
					name: `A reaction was removed in #${ctx.reaction.message.channel.name}`
				},
				thumbnail: { url },
				description: ctx.reaction.message.content || "[Embed]",
				fields: [
					{
						name: "Emoji",
						value: [
							ctx.reaction.emoji.id ? `:${ctx.reaction.emoji.name}:` : ctx.reaction.emoji.name,
							ctx.reaction.emoji.id ? `(${ctx.reaction.emoji.id})` : "",
							`| [[Link]](${url})`
						].join(" "),
						inline: false
					},
					{
						name: "Message ID",
						value: `${ctx.reaction.message.id} | [[Link]](https://discordapp.com/channels/${ctx.guild.id}/${ctx.channel.id}/${ctx.message.id})`,
						inline: true
					}
				],
				footer: {
					icon_url: ctx.reaction.message.author.displayAvatarURL,
					text: `${ctx.reaction.message.author.tag} in #${ctx.reaction.message.channel.name}`
				}, timestamp: ctx.reaction.message.createdTimestamp
			}));
		}
	}
};

const getUrl = emoji => {
	if (emoji.id) {
		if (emoji.animated)
			return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
		return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;
	}
	return `https://raw.githack.com/twitter/twemoji/v12.1.5/assets/72x72/${emoji.name.codePointAt(0).toString(16)}.png`;
};