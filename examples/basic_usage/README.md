# basic_usage

The smallest possible marionette project: it depends on `@hollymoon/marionette`
through the workspace and runs the CLI.

Build the root package first, since the example runs the built `dist/cli.mjs`:

```sh
pnpm --filter @hollymoon/marionette build
```

Then, from this directory:

```sh
pnpm exec marionette
# Hello, World!
```

`pnpm start` does the same thing.
