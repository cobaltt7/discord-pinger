import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const info = JSON.parse("");

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

Discord.login(process.env.BOT_TOKEN);

function error(user) {
	return (error) => {
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
				"5 * * * *" +
				"`\nIndex: " +
				"0",
		});
		return undefined;
	};
}
