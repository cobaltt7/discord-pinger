import fileSystem from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mustache from "mustache";

const GENERATED_JS_DIR = "__generated-js";

mustache.escape = (text) => text;
mustache.tags = ["[[", "]]"];
const render = mustache.render;
const dir = path.dirname(fileURLToPath(import.meta.url));
/** @type {{[key:string]:{}}} */
const config = JSON.parse(
	await fileSystem.readFile(path.resolve(dir, "./config.json")),
);
const configEntries = Object.entries(config);

async function emptyDir(dirToEmpty, keep = []) {
	for (const file of await fileSystem.readdir(
		path.resolve(dir, "../" + dirToEmpty),
	)) {
		if (!keep.includes(file))
			fileSystem.unlink(path.resolve(dir, "../" + dirToEmpty, file));
	}
}

await Promise.all([
	emptyDir(".github/workflows", ["generate.yml", "qotd.yml"]),
	emptyDir(GENERATED_JS_DIR),
]);

const templates = {
	yml: await fileSystem.readFile(path.resolve(dir, "./template.yml"), "utf8"),
	js: await fileSystem.readFile(path.resolve(dir, "./template.js"), "utf8"),
};

for (const cron in config) {
	if (Object.hasOwnProperty.call(config, cron)) {
		const info = config[cron];
		const index = configEntries.findIndex(([key]) => key === cron);
		fileSystem.writeFile(
			path.resolve(dir, "../" + GENERATED_JS_DIR + "/" + index + ".js"),
			render(templates.js, {
				cron,
				index,
				['"info']: JSON.stringify(info),
			}),
			"utf8",
		);
		fileSystem.writeFile(
			path.resolve(dir, "../.github/workflows/__" + index + ".yml"),
			render(templates.yml, {
				cron,
				index,
				['"info']: JSON.stringify(info),
			}),
			"utf8",
		);
	}
}
