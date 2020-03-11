const { Command } = require("discord.js-commando");

module.exports = class MemberCount extends Command {
	constructor(client) {
		super(client, {
			name: "membercount",
			memberName: "membercount",
			group: "misc",
			aliases: ["mcount"],
			description: "Get the member count of the server.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
		});
	}

	async run(message) {
		await message.guild.fetchMembers();
		const { memberCount: total, members } = message.guild;
		const [bots, users] = members.partition(m => m.user.bot);
		const counts = {
			total,
			users: users.size, bots: bots.size,
			online: users.filter(m => m.presence.status === "online").size,
			idle: users.filter(m => m.presence.status === "idle").size,
			offline: users.filter(m => m.presence.status === "offline").size,
			dnd: users.filter(m => m.presence.status === "dnd").size,
			mobile: users.filter(m => {
				if (!(m.presence.clientStatus instanceof Object)) return false;
				return Object.keys(m.presence.clientStatus).length < 2 && Object.keys(m.presence.clientStatus).includes("mobile");
			}).size,
			mobileDesktop: users.filter(m => {
				if (!(m.presence.clientStatus instanceof Object)) return false;
				return Object.keys(m.presence.clientStatus).length > 1 && Object.keys(m.presence.clientStatus).includes("mobile");
			}).size,
			open: users.filter(m => m.presence.status !== "offline").size
		};
		counts.desktop = counts.open - (counts.mobile + counts.mobileDesktop);
		const fields = [
			{
				name: `Of ${total} members in ${message.guild.name},`,
				value: [
					`${counts.users} are users`,
					`${counts.bots} are bots`
				].join("\n")
			},
			{
				name: `Going by status, of ${counts.users} users,`,
				value: [
					`${counts.online} are online`,
					`${counts.idle} are idle/AFK`,
					`${counts.dnd} are on do-not-disturb`,
					`${counts.offline} are either invisible or offline.`
				].join("\n")
			},
			{
				name: `Going by devices, of ${counts.open} users who have Discord open,`,
				value: [
					`${counts.desktop} are on their desktop/on the web`,
					`${counts.mobile} are on their mobile`,
					`${counts.mobileDesktop} are on both mobile and desktop/web`
				].join("\n")
			}
		];
		message.channel.send({ embed: { title: "Member count", description: fields.map(f => `**${f.name}**\n${f.value}`).join("\n\n"), thumbnail: { url: message.guild.iconURL} } });
	}
};