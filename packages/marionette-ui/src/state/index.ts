import { defineConfig } from "@hollymoon/container";

import { StateRoute } from "./stateRoute.js";
import { StateService } from "./stateService.js";

export const stateModule = defineConfig(StateService, StateRoute);

export { StateService } from "./stateService.js";
