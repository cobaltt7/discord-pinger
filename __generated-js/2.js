import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const info = JSON.parse('[{"user":"771422735486156811","message":{"content":"Hi Paul in the future, I'm Paul from the past. Assuming my code still works and it is 1:45 PM on April 27th 2023, you can start wearing your retainer only at night now. "}}]');

const Discord = new Client({
	intents: [intents.FLAGS.DIRECT_MESSAGES, intents.FLAGS.GUILDS],
});

Discord.once("ready", async () => {
	console.log(`Connected to Discord with ID`, Discord.application?.id);
	const promises = [];
	for (const user of info) {
		promises.push(
			(await Discord[user.user?"users":"channels"].fetch(user.user||user.channel).catch(error(user)))
				?.send(user.message)
				.catch(error(user)),
		);
	}
	await Promise.all(promises).catch(error({}));
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
				"45 18 27 4 *" +
				"`\nIndex: " +
				"2",
		});
		return undefined;
	};
}
