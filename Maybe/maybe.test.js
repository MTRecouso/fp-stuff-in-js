const Maybe = require("./maybe");
const { compose } = require("../common_functions");

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

describe("Functor implementation for Maybe", () => {
  test.each([
    ["Just", Maybe.Just(2)],
    ["Nothing", Maybe.Nothing()],
  ])
  ("Identity rule for Functors (%s). fmap id = id", 
  (_, fa) => {
    const identityFn = a => a;
    fmap_result = fa.fmap(identityFn)
    expect(fmap_result.valueOf()).toBe(fa.valueOf());
    expect(fmap_result.getType()).toBe(fa.getType());
  });


  const fa = Maybe.Just(2)
  const add5 = a => a + 5;
  const add3 = a => a + 3;
  test("Composition rule for Functors. fmap f . g = fmap f . fmap g", () => {
    expect(fa.fmap(compose(add3)(add5)).valueOf()).toBe(
      fa
          .fmap(add3)
          .fmap(add5)
          .valueOf()
      );
  })
});

describe("Monad implementation for Maybe", () => {
  const ma = Maybe.Just(2);
  const a = 2;

  const fa = a => Maybe.Just(a + 2);
  const fb = a => Maybe.Nothing(a + 2);

  test("Left identity rule for Monads. return a >>= f ≡ f a", () => {
    const left_exp = Maybe.mReturn(a).mBind(fa);
    const right_exp = fa(a)
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Right identity rule for Monads. m >>= return ≡ m", () => {
    const left_exp = ma.mBind(Maybe.mReturn);
    const right_exp = ma
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test.each([
    ['Only Just', fa],
    ['Just and Nothing', fb]
  ])
  ("Associatitity rule for Monads (%s). (m >>= f) >>= g ≡ m >>= (\\x -> f x >>= g)", 
  (_, f) => {
    const g = a => Maybe.Just(a * 2);
    
    const left_exp = ma.mBind(f).mBind(g)
    const right_exp = ma.mBind(x => f(x).mBind(g))
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });
});