const { Command } = require("discord.js-commando");

module.exports = class RemoveNote extends Command {
	constructor(client) {
		super(client, {
			name: "removenote",
			memberName: "removenote",
			group: "notes",
			description: "Remove a note from a specified user.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			userPermissions: ["ADMINISTRATOR"],
			args: [
				{
					key: "user",
					prompt: "User to remove the note from.",
					type: "user"
				},
				{
					key: "number",
					prompt: "Number of the note to be removed.",
					type: "integer",
					default: "1",
					validate: v => Number.isSafeInteger(Number(v)) && Number(v) > 0
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
			return message.channel.send({ embed: { description: `No notes found on ${args.user.tag}` } });
		if (Number(args.number) > notes.length)
			return message.channel.send({ embed: { description: "Invalid note number specified." } });
		const noteEntry = notes[targetUserId][args.number - 1];
		notes[targetUserId].splice(args.number - 1, 1);
		message.guild.settings.set("notes", notes);
		message.channel.send({
			embed: {
				title: `Note successfully removed from ${args.user.tag}`,
				fields: [
					{ name: `Note originally added by ${this.client.users.has(noteEntry.addedBy) ? this.client.users.get(noteEntry.addedBy).tag : noteEntry.addedBy} on ${new Date(noteEntry.timestamp).toUTCString()}`, value: noteEntry.note, inline: false }
				],
				thumbnail: { url: args.user.avatarURL }
			}
		});
	}
};