import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";
import fileSystem from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
/** @type {{[key:string]:{}}} */
const config = JSON.parse(
	await fileSystem.readFile(path.resolve(dir, "./todo.json")),
);
dotenv.config();

const Discord = new Client({
	intents: [intents.FLAGS.DIRECT_MESSAGES, intents.FLAGS.GUILDS],
});

Discord.once("ready", async () => {
	console.log(`Connected to Discord with ID`, Discord.application?.id);
	const promises = [];
			(await Discord.channels.fetch("901225174974726177").catch(error()))
				?.send({content: config[Math.floor(Math.random() * config.length)]})
				.catch(error(user))
	Discord.destroy();
})
	.on("disconnect", () => console.warn("Disconnected from Discord"))
	.on("debug", console.debug)
	.on("warn", console.warn)
	.on("error", console.error);

const tokenIndex=	process.argv.findIndex(e=>e==="token:")+1
Discord.login(tokenIndex?process.argv[tokenIndex]:process.env.BOT_TOKEN);

function error(user) {
	return async (error) => {
		(await Discord.users.fetch("914999467286093844")).send({
			content:
				"ERROR:\n```js\n" +
				JSON.stringify(error) +
				"\n```\nMessage: `" +
				error.message +
				"`\nStack: `" +
				error.stack +
				"`\nCode: `" +
				error.code +
				"`\nName: `" +
				error.name +
				"`\n\nUser: " +
				user.user +
				"`\nMessage: " +
				user.message +
				"`\nCron: " +
				"45 23 * * *" +
				"`\nIndex: " +
				"0",
		});
		return undefined;
	};
}
