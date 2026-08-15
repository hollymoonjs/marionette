# @hollymoon/marionette

Monorepo task orchestration framework. Its job is to build a dependency graph of
tasks and manage them with signals and states — builds, tests, linting, type
checks and watch-mode dev servers.

The guiding philosophy is **no magic**: everything is explicit, and every
capability beyond the core graph comes from a plugin.

> Status: early scaffold. `marionette()` builds a
> [`@hollymoon/container`](https://www.npmjs.com/package/@hollymoon/container)
> container that prints a greeting. Tasks, config and plugins come next.

## Usage

```sh
npx marionette
# Hello, World!
```

Programmatically:

```ts
import { marionette } from "@hollymoon/marionette";

const container = await marionette();
await container.destroy();
```

## Examples

`examples/` holds pnpm workspace packages that depend on the root package via
`workspace:*`. Build the root package first, then run the CLI from an example:

```sh
pnpm build
pnpm --dir examples/basic_usage exec marionette
# Hello, World!
```

## Development

Requires Node >= 20 and pnpm.

```sh
pnpm install
pnpm build        # tsdown, dual ESM + CJS with types
pnpm test         # vitest (pnpm test:watch to keep it running)
pnpm typecheck    # tsc
pnpm lint         # eslint, type-checked rules
pnpm format       # prettier
pnpm check        # everything above + publint + attw
```

The project is on TypeScript 6, the last release with a programmatic JS API.
TypeScript 7 is the native (Go) compiler and drops that API, which
typescript-eslint and `tsdown`'s declaration build still need. Bump to 7 once
typescript-eslint supports it.
