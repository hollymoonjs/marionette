# @hollymoon/marionette-ui

A web UI for [`@hollymoon/marionette`](../marionette). Enabling it starts an
express server that serves a React app and a small JSON API describing the
running marionette.

```ts
import { defineConfig } from "@hollymoon/marionette";
import { ui } from "@hollymoon/marionette-ui";

export default defineConfig({
    name: "my-project",
    plugins: [ui({ port: 5000, host: "127.0.0.1" })],
});
```

The defaults are port `4000` and host `127.0.0.1`.

```sh
npx marionette
# [marionette:ui] listening on http://127.0.0.1:5000
```

## How it is put together

The plugin is assembled from hollymoon modules rather than one class doing
everything:

| module    | components                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/` | `apiRouter` (a `Router` under `apiRouterKey`), `expressApp` (the app under `appKey`, with the api router mounted at `/api`), `ClientRoute`, `HttpServer` |
| `state/`  | `StateService` (projects the running marionette into a payload), `StateRoute` (exposes it at `/api/state`)                                               |

Routes are components that inject the router they belong to and register
themselves in `@Init()`. `HttpServer` listens in `@Run()`. The container runs
**every** `init` before **any** `run`, so the app is fully assembled by the time
it is served — no ordering flags, no "register your routes here" list. Adding an
endpoint means adding a component, and the two route modules never have to know
about each other: `apiRouter` is mounted on the app when the app is built, so
`/api` always wins over the client fallback regardless of init order.

`StateService` injects `configKey` and `PluginManager` from the marionette
container. Every enabled plugin gets a container parented to it, so the UI sees
marionette's internals through nothing but the package's public API, while its
own express and React components stay private to it.

`GET /api/state` returns the project name, uptime and the plugins with their
enabled state; the client polls it once a second. Everything else is served from
the built client bundle.

## Peer dependency

`@hollymoon/marionette` is a **peer** dependency, not a regular one. Hollymoon
keys `@Injectable()` classes by the class object itself, and `configKey` is a
plain `Symbol()`, so two copies of marionette in one install would mean
`@Inject(PluginManager)` looking up a different class than the host container
registered — a `ComponentNotFoundError` for something that visibly exists. One
copy, shared, is the only arrangement that works.

## The client

The React client is a separate vite build under `src/client`, with its own
tsconfig (jsx, DOM lib, bundler resolution), which is why the package tsconfig
excludes it and `typecheck` runs both projects. It builds into `dist/client`,
and the server resolves that directory relative to the emitted `dist/index.mjs`.
If it has not been built the server answers `503` with a page saying so, instead
of a blank `404`.

To work on it, run marionette in one terminal and vite in another — vite serves
on `4001` and proxies `/api` to `4000`:

```sh
pnpm dev:client
```

`pnpm dev` runs tsdown in watch mode, which cleans `dist` on every rebuild and
therefore removes `dist/client`, so use the vite dev server rather than the
bundle it serves.
