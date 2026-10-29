# zerodot website

The website for [zerodot](https://github.com/zerodot-io/zerodot), at zerodot.io. It is a TanStack Start app, built with Rsbuild and Tailwind CSS.

## Pages

| Route      | What it shows                                               |
| ---------- | ----------------------------------------------------------- |
| `/`        | Home page.                                                  |
| `/nodes`   | Built-in nodes and add-on node packages.                    |
| `/docs`    | Docs, built from the markdown files in the zerodot repo.    |
| `/pricing` | Commercial license tiers, buy buttons, and license details. |

## Run

```bash
bun install
bun run dev
```

The dev server runs on <http://localhost:3000>.

## Build

```bash
bun run build
bun run start
```

## Check

```bash
bun run check
```

This runs Biome for lint and format.

## Data

Two scripts refresh the data files in `src/data`:

- `bun run sync:catalog` refreshes `catalog.json` from the [zerodot-nodes](https://github.com/zerodot-io/zerodot-nodes) repo.
- `bun run sync:docs [path]` builds `docs.json` from the markdown docs of the zerodot repo. The default path is `../zerodot`.

## Pricing page

The page is `src/routes/pricing.tsx`.

- `TIERS` lists the paid license tiers. Each tier has a `checkout` link to a Polar checkout page.
- `DETAILS` lists the questions in the accordion. All items are open at first.
- The accordion is `src/components/Accordion.tsx`. It uses [Base UI](https://base-ui.com).

To change a price or a tier:

1. Change the product in Polar.
2. Change `TIERS` and `DETAILS` in `pricing.tsx`.
3. Change the tier table in `COMMERCIAL-LICENSE.md` and `README.md` in the zerodot repo.

Each Polar license product gives the shared Discord `Community` role and a Discord role for its tier.

## License

The zerodot code is under AGPL-3.0-only. A [Commercial License](https://github.com/zerodot-io/zerodot/blob/main/COMMERCIAL-LICENSE.md) is for people who want to keep their changes private.
