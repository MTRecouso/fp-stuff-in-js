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
    const rightPrecedenceMappend = Identity(2)
      .mappend(Identity(5))
      .mappend(Identity(7))
      .valueOf();
    const leftPrecedenceMappend = Identity(2)
      .mappend(Identity(5).mappend(Identity(7)))
      .valueOf();
    expect(rightPrecedenceMappend).toEqual(leftPrecedenceMappend);
  });
});
