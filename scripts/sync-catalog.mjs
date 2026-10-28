// Refresh src/data/catalog.json from the zerodot-nodes repo.
import { writeFile } from "node:fs/promises";

const URL =
	"https://raw.githubusercontent.com/zerodot-io/zerodot-nodes/main/catalog.json";

const res = await fetch(URL);
if (!res.ok) throw new Error(`catalog fetch failed: ${res.status}`);
const catalog = await res.json();
await writeFile(
	new URL("../src/data/catalog.json", import.meta.url),
	`${JSON.stringify(catalog, null, 2)}\n`,
);
console.log(`${catalog.packages.length} packages`);
