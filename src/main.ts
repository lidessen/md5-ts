import { utf8_encode } from "./lib";

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

const Round = [
    7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
    5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
    4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
    6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
]

function Table(i: number) {
    return Math.floor(Math.pow(2, 32) * Math.abs(Math.sin(i)));
}

function Factory(m: any) {
    return (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => (a + m(b, c, d) + x + t) << s + b;
}

for (const k in Methods) {
    if ((Methods as object).hasOwnProperty(k)) {
        Methods[k + k] = Factory(Methods[k]);
    }
}

function md5(str: string) {
    const a = A;
    const b = B;
    const c = C;
    const d = D;

    str = utf8_encode(str);
}

function prepare_message(str: string) {
    const length = str.length;

    return str;
}
