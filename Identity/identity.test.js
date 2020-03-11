const Identity = require("./identity");
const { compose } = require('../common_functions');

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
    const rightPrecedenceMappend = x
      .mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x.mappend(y.mappend(z)).valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });
});

describe("Monoid implementation for Identity", () => {
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
});

describe("Functor implementation for Identity", () => {
  test("Identity rule for Functors. fmap id = id", () => {
    const fa = Identity(2);
    const identityFn = a => a;
    expect(fa.fmap(identityFn).valueOf()).toBe(fa.valueOf());
  });

  test("Composition rule for Functors. fmap f . g = fmap f . fmap g", () => {
    const fa = Identity(2);
    const add5 = a => a + 5;
    const add3 = a => a + 3;
    expect(fa.fmap(compose(add3, add5)).valueOf()).toBe(
      fa
        .fmap(add3)
        .fmap(add5)
        .valueOf()
    );
  });
});
