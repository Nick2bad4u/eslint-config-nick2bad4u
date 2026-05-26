import { bench, describe } from "vitest";

describe("fixture benchmark", () => {
    bench("array map", () => {
        [
            1,
            2,
            3,
        ].map((value) => value * 2);
    });
});
