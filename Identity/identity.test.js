const Identity = require("./identity");
const { compose } = require("../common_functions");

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
  const x = Identity(2);
  test("Right identity rule for Monoids. x <> mempty = x", () => {
    const mempty = Identity().mempty();
    expect(x.mappend(mempty).valueOf()).toBe(x.valueOf());
  });

  test("Left identity rule for Monoids. mempty <> x = x", () => {
    const mempty = Identity().mempty();
    expect(mempty.mappend(x).valueOf()).toBe(x.valueOf());
  });
});

describe("Functor implementation for Identity", () => {
  const fa = Identity(2);

  test("Identity rule for Functors. fmap id = id", () => {
    const identityFn = a => a;
    expect(fa.fmap(identityFn).valueOf()).toBe(fa.valueOf());
  });

  test("Composition rule for Functors. fmap f . g = fmap f . fmap g", () => {
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

describe("Monad implementation for Identity", () => {
  const f = a => Identity(a + 2);
  const m = Identity(2);

  test("Left identity rule for Monads. return a >>= f ≡ f a", () => {
    const a = 2;
    expect(
      Identity()
        .mReturn(a)
        .mBind(f)
        .valueOf()
    ).toBe(f(a).valueOf());
  });

  test("Right identity rule for Monads. m >>= return ≡ m", () => {
    const m = Identity(2);
    expect(m.mBind(m.mReturn).valueOf()).toBe(m.valueOf());
  });

  test("Associatitity identity rule for Monads. (m >>= f) >>= g ≡ m >>= (\\x -> f x >>= g)", () => {
    const g = a => Identity(a * 2);
    expect(
      m
        .mBind(f)
        .mBind(g)
        .valueOf()
    ).toBe(m.mBind(x => f(x).mBind(g)).valueOf());
  });
});
