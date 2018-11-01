export function split(target: string | any[], step: number, markString: boolean = typeof target === "string") {
    if (typeof target === "string") target = target.split("");

    let result: any[] = target.map(
        (_, index: number) =>
            index % step === 0
                ? Array.from(Array(step).keys()).map((x: number) => target[index + x])
                : []
    )
    .filter((x: any[]) => x.length > 0);

    if (markString) result = result.map((x: any[]) => x.join(""))

    return result;
}

export function padding(str: string | any[], length: number, char: string, tail: boolean = true, isArray: boolean = Array.isArray(str)) {
    let arr;
    if (Array.isArray(str)) {
        arr = str;
    } else {
        arr = str.split("");
    }
    const paddingStr: any[] = range(length - str.length).map(() => char);
    const result = tail ? arr.concat(paddingStr) : paddingStr.concat(arr);
    return isArray ? result : result.join("");
}

export function little_endian(charCode: number) {
    return split(padding(charCode.toString(16), 8, "0", false), 2).reverse().join("");
}

export function range(...args: number[]) {
    const start: number = args.length === 1 ? 0 : args[0];
    const end: number = args.length === 2 ? args[1] : args[0] - 1;

    return Array.from(Array(end - start + 1).keys()).map((x: number) => x + start);
}

export function to_binary(code: number, bit: number = 8, max: number = Math.pow(2, bit) - 1) {
    if (code < 0) throw new Error("code should be greater than: 0");
    if (code > max) throw new Error("code should be less than: " + max);
    return padding(code.toString(2), bit, "0", false);
}

export function to_hex(code: number, bit: number = 8, max: number = Math.pow(16, bit) - 1) {
    if (code < 0) throw new Error("code should be greater than: 0");
    if (code > max) throw new Error("code should be less than: " + max);
    return padding(code.toString(16), bit, "0", false);
}

export function to_code(str: string) {
    if (str.substr(0, 2).toLowerCase() === "0b") return parseInt(str.substr(2, 8), 2);
    if (str.substr(0, 2).toLowerCase() === "0x") return parseInt(str.substr(2, 8), 16);
}

export function utf16_to_utf8(str: string) {
    return str.split("").map((char: string) => utf8_encode(char)).join("");
}

export function utf8_encode(char: string) {
    let utftext = "";
    const c = char.charCodeAt(0);
    if (c < 128) {
        utftext += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 0b11000000);
        utftext += String.fromCharCode((c & 0b00111111) | 0b10000000);
    } else {
        utftext += String.fromCharCode((c >> 12) | 0b11100000);
        utftext += String.fromCharCode(((c >> 6) & 0b00111111) | 0b10000000);
        utftext += String.fromCharCode((c & 0b00111111) | 0b10000000);
    }

    return utftext;
}

export function uint_add(...args: number[]) {
    const t = Uint32Array.from([0]);
    const x = Uint32Array.from(args);
    x.forEach(n => t[0] = t[0] + n);
    return t[0];
}

export function loop_shift_left(n: number, bits: number) {
    return (n << bits) | (n >>> (32 - bits));
}
