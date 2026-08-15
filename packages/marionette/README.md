# @hollymoon/marionette

Monorepo task orchestration framework. Its job is to build a dependency graph of
tasks and manage them with signals and states — builds, tests, linting, type
checks and watch-mode dev servers.

The guiding philosophy is **no magic**: everything is explicit, and every
capability beyond the core graph comes from a plugin.

> Status: early scaffold. `marionette()` builds a
> [`@hollymoon/container`](https://www.npmjs.com/package/@hollymoon/container)
> container holding the config and enables the configured plugins. Projects and
> tasks come next.

## Configuration

Put a `marionette.config.ts` in your project root:

```ts
import { defineConfig } from "@hollymoon/marionette";
import { ui } from "@hollymoon/marionette/ui";

export default defineConfig({
    name: "my-project",
    plugins: [ui()],
});
```

The CLI walks up from the working directory until it finds one of
`marionette.config.ts`, `.js`, `.mjs` or `.cjs` — in that order — and passes its
default export to `marionette()`. It fails if there is none. `.ts` configs are
loaded through Node's native type stripping, which is why the package requires
Node >= 22.18.

```sh
npx marionette
# [marionette:ui] enabled
```

Programmatically, the config is explicit and nothing is discovered for you:

```ts
import { configKey, marionette } from "@hollymoon/marionette";

const container = await marionette({ name: "my-project" });
container.get(configKey); // { name: "my-project" }
await container.destroy();
```

## Plugins

A plugin is a bag of hollymoon components. `createPlugin()` only groups them —
it has no behaviour of its own, it exists so plugin authors do not have to know
how the manager mounts them:

```ts
import { provide, run } from "@hollymoon/container";
import { createPlugin } from "@hollymoon/marionette";

export function myPlugin() {
    return createPlugin(
        provide(myKey, () => new MyThing()),
        run((container) => {
            container.get(myKey).start();
        }),
    );
}
```

Every enabled plugin gets its **own container**, parented to the marionette
container. So a plugin can inject anything marionette provides — the config, the
plugin manager, whatever core modules land later — while its own components stay
private to it, and disabling it tears down exactly what it built.

`PluginManager` is an `@Injectable()` class, so it is keyed by the class itself:

```ts
const plugins = container.get(PluginManager);

await plugins.enable(myPlugin()); // builds the plugin container
plugins.isEnabled(plugin); // true
await plugins.disable(plugin); // destroys it
await plugins.disableAll();
```

It injects the config and enables everything in `plugins` from its own `@Run()`
method, and picks up the container to parent them to from its `@Init()` method.
Outside a marionette container you hand it both yourself:

```ts
const plugins = new PluginManager({ plugins: [myPlugin()] });
plugins.init(someContainer);
await plugins.enableConfigured();
```

`enable()` and `disable()` are idempotent: enabling an already enabled plugin is
a no-op, and so is disabling one that is not enabled. Plugins listed in the
config are enabled while the marionette container starts, and every plugin still
enabled is disabled when that container is destroyed.

The manager keys plugins by identity, so `myPlugin()` called twice produces two
distinct plugins that mount independently. Hold on to the value you passed to
`enable()` if you want to disable it later.

### Bundled plugins

- `@hollymoon/marionette/ui` — a placeholder that logs when it is enabled and
  disabled. Real terminal UI comes later.

## Development

This package lives in the marionette monorepo. See the
[repository README](../../README.md) for the workspace layout and the toolchain
commands.
