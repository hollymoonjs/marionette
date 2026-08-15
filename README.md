# marionette

Monorepo task orchestration framework. Its job is to build a dependency graph of
tasks and manage them with signals and states — builds, tests, linting, type
checks and watch-mode dev servers.

The guiding philosophy is **no magic**: everything is explicit, and every
capability beyond the core graph comes from a plugin. This repository is a pnpm
workspace so that plugins are packages of their own, consuming the same public
API a third-party plugin would.

## Layout

| path                   | package                 | what it is                                |
| ---------------------- | ----------------------- | ----------------------------------------- |
| `packages/marionette`  | `@hollymoon/marionette` | the core: config, plugin manager, CLI     |
| `examples/basic_usage` | private                 | workspace package that runs the built CLI |

Start with [`packages/marionette/README.md`](packages/marionette/README.md) for
what marionette does and how plugins work.

## Development

Requires Node >= 22.18 and pnpm.

```sh
pnpm install
pnpm build        # every package, in dependency order
pnpm test         # every package
pnpm typecheck    # every package
pnpm lint         # eslint over the workspace, type-checked rules
pnpm format       # prettier over the workspace
pnpm check        # lint + format check, then each package's own check
```

Linting and formatting are configured once at the root and cover every package.
Building, testing and typechecking belong to the packages, so `pnpm -r` fans
them out; run them inside a package directory to work on just that one.

The project is on TypeScript 6, the last release with a programmatic JS API.
TypeScript 7 is the native (Go) compiler and drops that API, which
typescript-eslint and `tsdown`'s declaration build still need. Bump to 7 once
typescript-eslint supports it.
