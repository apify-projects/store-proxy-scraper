// Create tuples of any length recursively
export type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

export const chunkArray = <T extends unknown, N extends number>(arr: T[], size: N) => {
    const copy = [...arr];
    return [...Array(Math.ceil(arr.length / size))].map(() => copy.splice(0, size)) as Tuple<T, N>[];
};
