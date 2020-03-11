const { Command } = require("discord.js-commando");

module.exports = class AddNote extends Command {
	constructor(client) {
		super(client, {
			name: "addnote",
			memberName: "addnote",
			group: "notes",
			description: "Add a note for a specified user.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "user",
					prompt: "User to add the note on.",
					type: "user"
				},
				{
					key: "note",
					prompt: "Note to be added.",
					type: "string",
					validate: v => v.length && v.length < 1000
				}
			]
		});
	}

	async run(message, args) {
		const targetUserId = args.user.id;
		let notes = message.guild.settings.get("notes");
		if (!notes)
			notes = {};
		if (!Object.keys(notes).includes(targetUserId))
			notes[targetUserId] = [];
		const noteEntry = { timestamp: Date.now(), addedBy: message.author.id, note: args.note };
		notes[targetUserId].push(noteEntry);
		message.guild.settings.set("notes", notes);
		message.channel.send({
			embed: {
				title: `Note successfully added on ${args.user.tag}`,
				fields: [
					{ name: `Note by ${message.author.tag} on ${new Date(noteEntry.timestamp).toUTCString()}`, value: args.note, inline: false }
				],
				thumbnail: { url: args.user.avatarURL }
			}
		});
	}
};