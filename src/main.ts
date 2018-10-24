import { Mod, FloorDivide, MathChain } from "./math";

const Mod2 = Mod(2);
const Mod4 = Mod(4);
const Divide2 = FloorDivide(2);
const Divide16 = FloorDivide(16);

const A = 0x67452301;
const B = 0xefcdab89;
const C = 0x98badcfe;
const D = 0x10325476;

const Methods: any = {
    F(b: number, c: number, d: number) {
        return (b & c) | (~b & d);
    },
    G(b: number, c: number, d: number) {
        return (b & d) | (c & ~d);
    },
    H(b: number, c: number, d: number) {
        return b ^ c ^ d;
    },
    I(b: number, c: number, d: number) {
        return c ^ (b | ~d)
    }
}

export async function RoundFactory() {
    let t = [];
    for(let i = 0; i < 64; i++) {
        const round = Divide16(i) + 1;
        const pos = i % 4;
        t[i] = 8 - await GetStart(round) + (round % 2 === 1 ? 5 : Offset(pos)) * pos;
    }
    return t;
}

function Offset(n: number) {
    //5 5 5
    //4 5 6
    //7 5 7
    //4 5 6
    return (8 + n - 1) / 2;
}

function TableI(i: number) {
    return Math.floor(Math.pow(2,32) * Math.abs(Math.sin(i)));
}

export async function GetStart(n: number) {
    return await MathChain(n)
    .then(Mod4)
    .then(Divide2)
    .then((x: number) => Math.pow(2, x))
    .then(Math.log2)
    .then((x: number) => x + Mod4(n))
    .then(Mod4)
}

function Factory(m: any) {
    return (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => (a + m(b, c, d) + x + t) << s + b;
}

for (let k in Methods) {
    if ((Methods as Object).hasOwnProperty(k)) {
        Methods[k + k] = Factory(Methods[k]);
    }
}