import { describe, expect, it } from "vitest";

const Component = (): JSX.Element => <div>fixture</div>;

describe("component fixture", () => {
    it("creates a component", () => {
        expect(Component).toBeTypeOf("function");
    });
});
