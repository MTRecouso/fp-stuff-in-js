const Identity = require("./identity");

describe("Semigroup implementation for Identity", () => {
  test("Mappend of two Identity containing numbers sums the two and return an Identity with the result", () => {
    expect(
      Identity(4)
        .mappend(Identity(7))
        .valueOf()
    ).toBe(11);
  });

  test("Associativity rule for Semigroups. (x <> y) <> z = x <> (y <> z)", () => {
    const x = Identity(2);
    const y = Identity(5);
    const z = Identity(7);
    const rightPrecedenceMappend = 
      x.mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x
      .mappend(y.mappend(z))
      .valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });

  test("Right identity rule for Monoids. x <> mempty = x", () => {
    const x = Identity(2);
    const mempty = Identity().mempty();
    expect(x.mappend(mempty).valueOf()).toBe(x.valueOf());
  });

  test("Left identity rule for Monoids. mempty <> x = x", () => {
    const x = Identity(2);
    const mempty = Identity().mempty();
    expect(mempty.mappend(x).valueOf()).toBe(x.valueOf());
  });

  test("Left identity rule for Monoids. mempty <> x = x", () => {
    const x = Identity(2);
    const mempty = Identity().mempty();
    expect(mempty.mappend(x).valueOf()).toBe(x.valueOf());
  });
});
