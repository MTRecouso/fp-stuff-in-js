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

test("Mappend should combine two objects", () => {
    expect(mappend({a: "aaa", b:"bbb"}, {c: "ccc", d: "ddd"})).toEqual({a: "aaa", b: "bbb", c: "ccc", d: "ddd"});
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