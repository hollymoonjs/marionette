# basic_usage

The smallest possible marionette project: it depends on `@hollymoon/marionette`
through the workspace, defines a `marionette.config.ts` and runs the CLI, which
prints the loaded config.

Build the root package first, since the example runs the built `dist/cli.mjs`:

```sh
pnpm --filter @hollymoon/marionette build
```

Then, from this directory:

```sh
pnpm exec marionette
# { name: 'basic_usage' }
```

`pnpm start` does the same thing.
