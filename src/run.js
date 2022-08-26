import { AttachmentBuilder, Client, GatewayIntentBits, Partials } from "discord.js";
import config from "./config.js";
const info = await config[process.env.cron || ""]?.();
if (!info) throw new ReferenceError("Unknown cron: " + process.env.cron);

process
	.on("uncaughtException", (err, origin) => logError(err, origin))
	.on("warning", (err) => logError(err, "warning"));

const Discord = new Client({
	allowedMentions: { parse: ["users"], repliedUser: true },

	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],

	failIfNotExists: false,

	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
	ws: { large_threshold: 0 },
});

Discord.once("ready", async (client) => {
	console.log(`Connected to Discord with tag ${client.user.tag ?? ""}`);

	const promises = info.map(async (toSend) => {
		if (toSend.channel) {
			const channel = await client.channels.fetch(toSend.channel);
			if (!channel?.isTextBased() || channel?.isDMBased())
				throw new ReferenceError(`${toSend.channel} is not a text-based channel`);
			const message = await channel.send(toSend.message);
			// @ts-expect-error
			await toSend.afterChannel?.(message);
		}
		if (toSend.user) {
			const user = await client.users.fetch(toSend.user);
			const message = await user.send(toSend.message);
			await toSend.afterUser?.(message);
		}
	});

	await Promise.all(promises);
	Discord.destroy();
})
	.on("disconnect", () => console.warn("Disconnected from Discord"))
	.on("debug", console.debug)
	.on("warn", process.emitWarning)
	.on("error", (error) => {
		throw error;
	});

Discord.login(process.env.token);

/**
 * @param {unknown} error
 * @param {string} event
 */
async function logError(error, event) {
	try {
		console.error(error);
		if (
			error &&
			["DeprecationWarning", "ExperimentalWarning"].includes(/** @type {any} */ (error).name)
		)
			return;

		return await (
			await Discord.users.fetch("914999467286093844")
		).send({
			content: `Error occurred in **${event}**, cron **[[cron]]**!`,
			files: [
				new AttachmentBuilder(Buffer.from(generateError(error), "utf-8"), {
					name: "error.json",
				}),
			],
		});
	} catch (help) {
		console.error(help);
		process.exit(1);
	}
}

/**
 * @param {any} error
 *
 * @returns {string}
 */
const generateError = (error) => {
	return !("toString" in error) ||
		typeof error.toString !== "function" ||
		error.toString().startsWith("[object ") ||
		error.prototype instanceof Error ||
		error instanceof Error
		? JSON.stringify(
				error.prototype instanceof Error || error instanceof Error
					? {
							name: error.name,
							message: error.message,
							type: error.type,
							code:
								error.code &&
								Object.keys(error)[
									Object.values(error).findIndex((val) => val === error.code)
								],
							number: error.errno,
							errors: error.errors?.map(generateError),
							actual: error.actual,
							expected: error.expected,
							generated: error.generatedMessage,
							operator: error.operator,
							global: error.global,
							limit: error.limit,
							method: error.method,
							path: error.path,
							route: error.route,
							timeout: error.timeout,
							constraint: error.constraint,
							stack: error.stack.split("\n"),
							...error,
					  }
					: { ...error },
				undefined,
				"  ",
		  )
		: error.toString();
};
