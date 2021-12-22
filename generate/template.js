import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const info = JSON.parse('[["info]]');

const Discord = new Client({
	intents: [intents.FLAGS.DIRECT_MESSAGES, intents.FLAGS.GUILDS],
});

Discord.once("ready", async () => {
	console.log(`Connected to Discord with ID`, Discord.application?.id);
	const promises = [];
	for (const user of info) {
		promises.push(
			(await Discord.users.fetch(user.user).catch(error(user)))
				?.send({
					content: user.message,
				})
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
				"[[cron]]" +
				"`\nIndex: " +
				"[[index]]",
		});
		return undefined;
	};
}
