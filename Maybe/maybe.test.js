const Maybe = require("./maybe");

describe("Semigroup implementation for Maybe", () => {
  test.each([
    ["Two Just", Maybe.Just(4), Maybe.Just(7), 11, "Just"],
    ["Two Nothing", Maybe.Nothing(), Maybe.Nothing(), undefined, "Nothing"],
    ["Just and Nothing", Maybe.Just(2), Maybe.Nothing(), 2, "Just"]

  ])(
    "Mappend of two %s",
    (_, a, b, expected_value, expected_type) => {
      const mappend_result = a.mappend(b);
      expect(mappend_result.valueOf()).toBe(expected_value);
      expect(mappend_result.getType()).toBe(expected_type);
    }
  );

  test.each([
    ["Just", Maybe.Just(2), Maybe.Just(5), Maybe.Just(7)],
    ["Just and Nothing", Maybe.Just(2), Maybe.Nothing(), Maybe.Just(7)],
    ["Nothing", Maybe.Nothing(), Maybe.Nothing(), Maybe.Nothing()]

  ])("Associativity rule for Semigroups (%s). (x <> y) <> z = x <> (y <> z)", 
  (_ ,x, y, z) => {
    const rightPrecedenceMappend = x
      .mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x.mappend(y.mappend(z)).valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });
});

describe("Monoid implementation for Maybe", () => {
    const x = Maybe.Just(2);
    const mempty = Maybe.mempty();
    test("Right identity rule for Monoids. x <> mempty = x", () => {
      expect(x.mappend(mempty).valueOf()).toBe(x.valueOf());
    });
  
    test("Left identity rule for Monoids. mempty <> x = x", () => {
      expect(mempty.mappend(x).valueOf()).toBe(x.valueOf());
    });
});