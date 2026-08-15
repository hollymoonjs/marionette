# basic_usage

The smallest possible marionette project: it depends on `@hollymoon/marionette`
through the workspace, defines a `marionette.config.ts` that enables the `ui`
plugin, and runs the CLI.

Build the root package first, since the example runs the built `dist/cli.mjs`:

```sh
pnpm --filter @hollymoon/marionette build
```

Then, from this directory:

```sh
pnpm exec marionette
# [marionette:ui] enabled
```

`pnpm start` does the same thing.
