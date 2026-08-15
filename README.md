# @hollymoon/marionette

Monorepo task orchestration framework. Its job is to build a dependency graph of
tasks and manage them with signals and states — builds, tests, linting, type
checks and watch-mode dev servers.

The guiding philosophy is **no magic**: everything is explicit, and every
capability beyond the core graph comes from a plugin.

> Status: early scaffold. `marionette()` builds a
> [`@hollymoon/container`](https://www.npmjs.com/package/@hollymoon/container)
> container holding the config, which it prints. Projects, tasks and plugins
> come next.

## Configuration

Put a `marionette.config.ts` in your project root:

```ts
import { defineConfig } from "@hollymoon/marionette";

export default defineConfig({
    name: "my-project",
});
```

The CLI walks up from the working directory until it finds one of
`marionette.config.ts`, `.js`, `.mjs` or `.cjs` — in that order — and passes its
default export to `marionette()`. It fails if there is none. `.ts` configs are
loaded through Node's native type stripping, which is why the package requires
Node >= 22.18.

```sh
npx marionette
# { name: 'my-project' }
```

Programmatically, the config is explicit and nothing is discovered for you:

```ts
import { configKey, marionette } from "@hollymoon/marionette";

const container = await marionette({ name: "my-project" });
container.get(configKey); // { name: "my-project" }
await container.destroy();
```

## Examples

`examples/` holds pnpm workspace packages that depend on the root package via
`workspace:*`. Build the root package first, then run the CLI from an example:

```sh
pnpm build
pnpm --dir examples/basic_usage exec marionette
# { name: 'basic_usage' }
```

## Development

Requires Node >= 22.18 and pnpm.

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
