import {
  padding,
  to_binary,
  split,
  utf16_to_utf8,
  little_endian,
  uint_add,
  loop_shift_left
} from './lib';

const A = 0x67452301;
const B = 0xefcdab89;
const C = 0x98badcfe;
const D = 0x10325476;

function F(b: number, c: number, d: number) {
  return (b & c) | (~b & d);
}

function G(b: number, c: number, d: number) {
  return (b & d) | (c & ~d);
}

function H(b: number, c: number, d: number) {
  return b ^ c ^ d;
}

function I(b: number, c: number, d: number) {
  return c ^ (b | ~d);
}

const S = [
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21
];

function T(i: number) {
  return Math.floor(Math.pow(2, 32) * Math.abs(Math.sin(i + 1)));
}

function x_index(i: number) {
  if (i >= 0 && i <= 15) return i;
  if (i >= 16 && i <= 31) return (5 * i + 1) % 16;
  if (i >= 32 && i <= 47) return (3 * i + 5) % 16;
  if (i >= 48 && i <= 63) return (7 * i) % 16;
  return 0;
}

function wrap(m: any) {
  return (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number
  ) => {
    // 循环左移
    return uint_add(loop_shift_left(uint_add(a, m(b, c, d), x, t), s), b);
  };
}

function porcess_message(str: string) {
  const length = str.length;
  const length_of_zero = 63 - ((length + 8) % 64);
  str += String.fromCharCode(0b10000000);
  const strArray = padding(
    str.split(''),
    length + 1 + length_of_zero,
    String.fromCharCode(0)
  );

  // use 64 bit to store the raw message length at the end
  const tail = split(
    padding(to_binary((length * 8) % Math.pow(2, 64), 64), 64, '0'),
    8
  )
    .reverse()
    .map(x => parseInt(x, 2));

  const head = (strArray as any[]).map(x => x.charCodeAt(0));
  return Uint32Array.from(
    split(head.concat(tail), 4)
      .map(x =>
        x.map((t: number) => padding(t.toString(16), 2, '0', false)).join('')
      )
      .map(x => parseInt(x, 16))
      .map(x => parseInt(little_endian(x), 16))
  );
}

function fghi(i: number) {
  if (i >= 0 && i <= 15) return F;
  if (i >= 16 && i <= 31) return G;
  if (i >= 32 && i <= 47) return H;
  if (i >= 48 && i <= 63) return I;
}

function fghi_wrapped(i: number) {
  return wrap(fghi(i));
}

export default function md5(str: string) {
  str = utf16_to_utf8(str);
  const uint32_array = porcess_message(str);
  const result = Uint32Array.from([A, B, C, D]);
  const chunks = split(Array.from(uint32_array), 16);
  for (const chunk of chunks) {
    const a = result[0];
    const b = result[1];
    const c = result[2];
    const d = result[3];

    for (let i = 0; i < 64; i++) {
      result[(4 - (i % 4)) % 4] = fghi_wrapped(i)(
        result[(4 - (i % 4)) % 4],
        result[(4 - (i % 4) + 1) % 4],
        result[(4 - (i % 4) + 2) % 4],
        result[(4 - (i % 4) + 3) % 4],
        chunk[x_index(i)],
        S[i],
        T(i)
      );
    }

    result[0] = a + result[0];
    result[1] = b + result[1];
    result[2] = c + result[2];
    result[3] = d + result[3];
  }
  return Array.from(result)
    .map(x => little_endian(x))
    .join('')
    .toLowerCase();
}
