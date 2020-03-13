const Maybe = require("./maybe");

describe("Semigroup implementation for Maybe", () => {
  test("Mappend of two Just containing numbers sums the two and return an Just with the result", () => {
    const mappend_result = Maybe.Just(4).mappend(Maybe.Just(7))
    expect(mappend_result.valueOf()).toBe(11);
    expect(mappend_result.getType()).toBe('Just');
  });

  test("Mappend of two Nothing returns Nothing", () => {
    const mappend_result = Maybe.Nothing().mappend(Maybe.Nothing())
    expect(mappend_result.getType()).toBe('Nothing');
  });

  test("Associativity rule for Semigroups (Just). (x <> y) <> z = x <> (y <> z)", () => {
    const x = Maybe.Just(2);
    const y = Maybe.Just(5);
    const z = Maybe.Just(7);
    const rightPrecedenceMappend = x
      .mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x.mappend(y.mappend(z)).valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });

  test("Associativity rule for Semigroups (Just and Nothing). (x <> y) <> z = x <> (y <> z)", () => {
    const x = Maybe.Just(2);
    const y = Maybe.Nothing();
    const z = Maybe.Just(7);
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