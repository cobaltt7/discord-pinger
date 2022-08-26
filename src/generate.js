import fileSystem from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import mustache from "mustache";

mustache.tags = ["[[", "]]"];

const dir = path.dirname(fileURLToPath(import.meta.url));

for (const file of await fileSystem.readdir(path.resolve(dir, `../github/workflows`)))
	if (!file.startsWith("__")) fileSystem.unlink(path.resolve(dir, `../github/workflows`, file));

const template = await fileSystem.readFile(
	path.resolve(dir, "./github/workflows/_template.yml"),
	"utf8",
);

await Promise.all(
	Object.keys(config).map((cron, index) =>
		fileSystem.writeFile(
			path.resolve(dir, `../.github/workflows/__${index}.yml`),
			mustache.render(template, { cron, index }, {}, { escape: (text) => text }),
			"utf8",
		),
	),
);
