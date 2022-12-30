import { ChannelType } from "discord.js";
import fileSystem from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @type {{
 * 	[key: string]: () => import("discord.js").Awaitable<
 * 		{
 * 			message: string | import("discord.js").MessagePayload | import("discord.js").MessageOptions;
 * 			user?: string;
 * 			channel?: string;
 * 			afterUser?: (message: import("discord.js").Message<false>) => import("discord.js").Awaitable<void>;
 * 			afterChannel?: (message: import("discord.js").Message<true>) => import("discord.js").Awaitable<void>;
 * 		}[]
 * 	>;
 * }}
 */
export default {
	"13 5 7 10 *": () => [
		{ message: "Happy birthday!", user: "771422735486156811" },
		{
			message:
				"<@&904021142052945941> It's <@771422735486156811>'s birthday! He's now " +
				(new Date().getFullYear() - 2_007) +
				" years old!",
			channel: "883922462704807956",
		},
	],
// 	"50 0 * * *": () => [{ message: "<@771422735486156811>", channel: "901225231014821968" }],
	"0 12 * * *": async () => {
		const dir = path.dirname(fileURLToPath(import.meta.url));
		const qotds = JSON.parse(
			await fileSystem.readFile(path.resolve(dir, "./qotds.json"), "utf-8"),
		);

		const index = Math.floor(Math.random() * qotds.length);
		const qotd = qotds[index];
		qotds.splice(index, 1);
		await fileSystem.writeFile(
			path.resolve(dir, "./qotds.json"),
			JSON.stringify(qotds, null, "	"),
			"utf8",
		);

		return [
			{
				channel: "965682181169086474",
				message: `<@&965682387533070466>\n**${qotd.question || qotd}**${
					qotd.comment ? `\n${qotd.comment}` : ""
				}`,
				async afterChannel(message) {
					if (message.channel.type === ChannelType.GuildNews && (qotd.publish ?? true))
						await message.crosspost();

					await message.startThread({
						name: truncateText(qotd.question || qotd, 100),
					});
					for (const reaction of qotd.reactions || []) await message.react(reaction);
				},
			},
		];
	},
};
/**
 * Slice a string so that it fits into a given length.
 *
 * @param {string} text - The string to truncate.
 * @param {number} maxLength - The maximum length of the string.
 *
 * @returns {string} - The truncated string.
 */
export function truncateText(text, maxLength) {
	const firstLine = text.split("\n")[0] ?? "";

	return firstLine.length > maxLength || !text.includes("\n")
		? `${firstLine.slice(0, Math.max(0, maxLength - 1))}…`
		: firstLine;
}
