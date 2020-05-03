const {mappend} = require('./common_functions');

test("Mappend should sum two integers", () => {
    expect(mappend(2,4)).toBe(6);
});

test("Mappend should do an AND operation with two booleans", () => {
    expect(mappend(true, false)).toBe(false);
});

test("Mappend should concatenate two strings", () => {
    expect(mappend("star", "fox")).toBe("starfox");
});

describe("Mappend of two objects should conform to the Semigroup and Monoid laws", () => {
    test.each([
        [{a: "aaa", b:"bbb", c: 1}, {c: 4, b: "BBBB", d: {g: true}}, {e: "eee", f: "fff", d: {c: true, g: false}}],
        [{c: 5, b: {mempty: true}},{c: 3},{b: {f: "eee"}}],    
    ])
    ("Associativity rule for Semigroups (%s). (x <> y) <> z = x <> (y <> z)", 
    (x, y, z) => {
        const rightPrecedenceMappend = mappend(x, mappend(y, z));
        const leftPrecedenceMappend = mappend(mappend(x, y), z);
        expect(rightPrecedenceMappend).toStrictEqual(leftPrecedenceMappend);
    });

    test("Associativity rule for Semigroups on objects with functions", 
    () => {
        const x = {a: x => x + 5, c: 5, b: {mempty: true}}
        const y = {c: 3, a: x => x * 3}
        const z = {b: {f: "eee"}, a: x => x * x}
        const rightPrecedenceMappend = mappend(x, mappend(y, z));
        const {a, b, c} = mappend(mappend(x, y), z);
        expect(rightPrecedenceMappend).toMatchObject({b, c});
        expect(rightPrecedenceMappend.a(2)).toBe(a(2))
    })
});

test("Mappend of two functions should return a function that mappends the result of each one", () => {
    const add3 = a => a + 3;
    const double = a => a * 2;
    const input = 2;
    expect(mappend(add3, double)(input)).toEqual(mappend(add3(input), double(input)));
});

test("Mappend of a number with with mempty should return the same number", () => {
    const mempty = {mempty: true};
    expect(mappend(1, mempty)).toBe(1);
});

test("Mappend of a function with mempty should return a function that mappends its output with mempty", () => {
    const add3 = a => a + 3;
    const input = 2;
    expect(mappend(add3, {mempty: true})(input)).toEqual(mappend(add3(input), {mempty: true}));
});