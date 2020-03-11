const config = require("./config.json");
const { Client: CommandoClient, FriendlyError } = require("discord.js-commando");
const JSONSettingsProvider = require("./helpers/JsonSettingsProvider.js");
const ServiceHandler = require("./helpers/ServiceHandler.js");
const { readdirSync } = require("fs");
const { resolve } = require("path");
const log = require("fancy-log");
const client = new CommandoClient({
	owner: config.owners,
	commandEditableDuration: 0,
	nonCommandEditable: false,
	unknownCommandResponse: false,
	commandPrefix: config.prefix
});

try {
	client.setProvider(new JSONSettingsProvider("./settings.json"));

	client.registry.registerDefaultTypes();

	for (const entity of readdirSync("./commands/", { withFileTypes: true })) {
		if (entity.isDirectory()) {
			client.registry.registerGroup(entity.name);
			for (const file of readdirSync(`./commands/${entity.name}`)) {
				if (file.endsWith(".js"))
					client.registry.registerCommand(require(`./commands/${entity.name}/${file}`));
			}
		}
	}

	client.handler = new ServiceHandler(client);
	client.handler.initialize(resolve("./services/"));

	client
		.once("ready", () => {
			log(`Logged in as ${client.user.tag} (${client.user.id})`);
			client.user.setActivity(`Type ${client.commandPrefix}help for help!`);
		})
		.on("commandError", (command, err) => {
			if (err instanceof FriendlyError) return;
			log.error(`Error in command ${command.groupID}:${command.name}`, err);
		})
		.on("error", log.error);

	client.login(config.token);
} catch (err) {
	log.error(err);
}
