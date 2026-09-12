type Data = { name: string; value: number };

export type EmptyData = Omit<Data, "name" | "value">;
