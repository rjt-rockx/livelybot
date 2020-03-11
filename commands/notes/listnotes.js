const { Command } = require("discord.js-commando");
const FieldPaginator = require("../../helpers/FieldPaginator.js");

module.exports = class ListNotes extends Command {
	constructor(client) {
		super(client, {
			name: "listnotes",
			memberName: "listnotes",
			group: "notes",
			description: "List all notes on a specified user.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "user",
					prompt: "User to add the note on.",
					type: "user"
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
		if (!notes[targetUserId].length)
			message.channel.send({ embed: { description: "No notes found on this user." } });
		if (notes[targetUserId].length) {
			const noteFields = notes[targetUserId].map((noteEntry, number) => ({
				name: `#${number + 1}: Added by ${this.client.users.has(noteEntry.addedBy) ? this.client.users.get(noteEntry.addedBy).tag : noteEntry.addedBy} on ${new Date(noteEntry.timestamp).toUTCString()}`,
				value: noteEntry.note,
				inline: false
			}));
			new FieldPaginator(message.channel, message.author, noteFields, 15, {
				embedTemplate: {
					title: `Notes on ${args.user.tag}`,
					thumbnail: { url: args.user.avatarURL }
				}
			});
			return;
		}
	}
};