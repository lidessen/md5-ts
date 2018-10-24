import { GetStart, RoundFactory } from "./main";

// const n = 1;

// describe.each([
//     [1, 1],
//     [2, 3],
//     [3, 4],
//     [4, 2]
// ])("GetStart(%i) should be %i", (a, expected) => {
//     expect(GetStart(a)).toBe(expected);
// });

test("1", async () => {
    expect(await GetStart(1)).toBe(1);
})

test("2", async () => {
    expect(await GetStart(2)).toBe(3);
})

test("3", async () => {
    expect(await GetStart(3)).toBe(4);
})

test("4", async () => {
    expect(await GetStart(4)).toBe(2);
})

test("Round", async () => {
    expect(await RoundFactory()).toBe([
        7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
        5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
        4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
        6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
    ]);
})