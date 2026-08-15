# basic_usage

The smallest possible marionette project: it depends on `@hollymoon/marionette`
and `@hollymoon/marionette-ui` through the workspace, defines a
`marionette.config.ts` that enables the `ui` plugin, and runs the CLI.

Build the packages first, since the example runs the built `dist/cli.mjs` and
the plugin serves its built client bundle:

```sh
pnpm --dir ../.. build
```

Then, from this directory:

```sh
pnpm exec marionette
# [marionette:ui] listening on http://127.0.0.1:5000
```

`pnpm start` does the same thing. The process stays up serving the UI until you
interrupt it.
