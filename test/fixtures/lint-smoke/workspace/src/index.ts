export interface FixtureRecord {
    readonly enabled: boolean;
    readonly name: string;
}

export const createFixtureRecord = (name: string): FixtureRecord => ({
    enabled: true,
    name,
});
