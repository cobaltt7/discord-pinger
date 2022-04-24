import { Client, Intents as intents } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const info = JSON.parse('[{"channel":"901225174974726177","message":{"content":"(replying to https://discord.com/channels/828680792519606380/966706770812764260/967553253111898182):\nYes, but of what?\n\n@everyone here’s your hint now get solving\nif you don’t want pings, you can unreact in <#883922462704807956>, but then you lose access to the channel...deal with it"}}]');

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
				"* * * * *" +
				"`\nIndex: " +
				"3",
		});
		return undefined;
	};
}
