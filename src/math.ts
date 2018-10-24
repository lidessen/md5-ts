export function Mod(n: number) {
    return (x: number) => Math.abs(x - 1) % n + 1;
}

export function FloorDivide(n: number) {
    return (x: number) => Math.floor(x / n);
}

export function MathChain(n: number) {
    return Promise.resolve(n);
}