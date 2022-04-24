import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";
import fileSystem from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
	await fileSystem.readFile(path.resolve(dir, "./todo.json")),
);
dotenv.config();

const Discord = new Client({
	intents: [intents.FLAGS.DIRECT_MESSAGES, intents.FLAGS.GUILDS],
});
const index=Math.floor(Math.random() * config.length)
	const chosen=config[index]
config.splice(index, 1);
Discord.once("ready", async () => {
	console.log(`Connected to Discord with ID`, Discord.application?.id);
const msg=	await	(await Discord.channels.fetch("965682181169086474"))
				?.send({content: "<@&965682387533070466>\n**"+chosen.question+"**"+(chosen.comment?"\n"+chosen.comment:"")})
if(chosen.publish??true)await chosen.crosspost();
	for (const reaction of chosen.reactions) {
		await msg.react(reaction);
	}
	await msg.startThread({
			autoArchiveDuration: 1_440, // 24 hours
			name: chosen.question
		});
await	Discord.destroy();
})
	.on("disconnect", () => console.warn("Disconnected from Discord"))
	.on("debug", console.debug)
	.on("warn", console.warn)
	.on("error", console.error);

const tokenIndex=	process.argv.findIndex(e=>e==="token:")+1
await Discord.login(tokenIndex?process.argv[tokenIndex]:process.env.BOT_TOKEN);
await fileSystem.writeFile(path.resolve(dir, "./todo.json"), JSON.stringify(config,null,"	"),"utf8")
