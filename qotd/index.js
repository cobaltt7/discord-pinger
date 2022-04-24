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
			(await Discord.channels.fetch("901225174974726177"))
				?.send({content: config[Math.floor(Math.random() * config.length)]})
	Discord.destroy();
})
	.on("disconnect", () => console.warn("Disconnected from Discord"))
	.on("debug", console.debug)
	.on("warn", console.warn)
	.on("error", console.error);

const tokenIndex=	process.argv.findIndex(e=>e==="token:")+1
await Discord.login(tokenIndex?process.argv[tokenIndex]:process.env.BOT_TOKEN);
