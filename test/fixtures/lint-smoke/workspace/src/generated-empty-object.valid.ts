type Data = { name: string; value: number };

export type NamedData = Pick<Data, "name">;
export type Dictionary = Record<string, unknown>;
export type GenericDictionary<Key extends string> = Record<Key, unknown>;
