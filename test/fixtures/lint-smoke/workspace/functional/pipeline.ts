const double = (value: number): number => value * 2;

export const runPipeline = (values: readonly number[]): readonly number[] =>
    values.map(double);
