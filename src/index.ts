import {
    createContainer,
    run,
    type ReadyContainer,
} from "@hollymoon/container";

export function marionette(): Promise<ReadyContainer> {
    return createContainer(
        run(() => {
            console.log("Hello, World!");
        }),
    );
}
