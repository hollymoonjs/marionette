import { Init, Inject, Injectable } from "@hollymoon/container/decorators";
import type { Router } from "express";

import { apiRouterKey } from "../server/index.js";
import { StateService } from "./stateService.js";

@Injectable()
export class StateRoute {
    readonly #router: Router;
    readonly #state: StateService;

    constructor(
        @Inject(apiRouterKey) router: Router,
        @Inject(StateService) state: StateService,
    ) {
        this.#router = router;
        this.#state = state;
    }

    @Init()
    mount(): void {
        this.#router.get("/state", (_request, response) => {
            response.json(this.#state.getState());
        });
    }
}
