const {Either, either} = require("./either");
const { compose } = require("../common_functions");

describe("Tests of function either", () => {
    test("Should unwrap Left and apply the first param function", () => {
        either((a) => a.length,(a) => a * 3,Either.Left(6))
    });

    test("Should unwrap Right and apply the second param function", () => {
        either((a) => a.length,(a) => a * 3,Either.Right(6))
    });
})

describe("Semigroup implementation for Either", () => {
  test("Mappend of two Right returns the first param", () => {
    expect(
      Either.Right(4)
        .mappend(Either.Right(7))
        .valueOf()
    ).toBe(4);
  });

  test("Mappend of a Left with a Right returns the second param", () => {
    expect(
      Either.Left(4)
        .mappend(Either.Right(7))
        .valueOf()
    ).toBe(7);
  });

  test("Mappend of two Left returns the second param", () => {
    expect(
      Either.Left(4)
        .mappend(Either.Left(7))
        .valueOf()
    ).toBe(7);
  });

  test("Associativity rule for Semigroups. (x <> y) <> z = x <> (y <> z)", () => {
    const x = Either.Right(2);
    const y = Either.Right(5);
    const z = Either.Right(7);
    const rightPrecedenceMappend = x
      .mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x.mappend(y.mappend(z)).valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });
});

describe("Functor implementation for Either", () => {
    const fa = Either.Right(2);
    const fb = Either.Left(2);
    const identityFn = a => a;
    const add5 = a => a + 5;
    const add3 = a => a + 3;

    test("Identity rule for Functors (Right). fmap id = id", () => {
        expect(fa.fmap(identityFn).valueOf()).toBe(fa.valueOf());
    });

    test("Identity rule for Functors (Left). fmap id = id", () => {
        expect(fb.fmap(identityFn).valueOf()).toBe(fb.valueOf());
    });

    test("Composition rule for Functors (Right). fmap f . g = fmap f . fmap g", () => {
        expect(fa.fmap(compose(add3)(add5)).valueOf()).toBe(
        fa
            .fmap(add3)
            .fmap(add5)
            .valueOf()
        );
    });

    test("Composition rule for Functors (Left). fmap f . g = fmap f . fmap g", () => {
        expect(fb.fmap(compose(add3) (add5)).valueOf()).toBe(
        fb
            .fmap(add3)
            .fmap(add5)
            .valueOf()
        );
    });
});

describe("Apply Implementation for Either", () => {
  test.each([
    ["Right", Either.Right(a => a * 2)],
    ["Left and Right", Either.Left(a => a * 2)]
  ])
  ("Composition rule for Apply (%s) (.) <$> u <.> v <.> w = u <.> (v <.> w)", (_, v) => {
    const u = Either.Right(a => a + 2);
    const w = Either.Right(4);
    const left_exp = w.liftF2(v.liftF2(u.fmap(compose)));
    const right_exp = w.liftF2(v).liftF2(u);
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });
});

describe("Monad implementation for Either", () => {
  const fa = a => Either.Right(a + 2);
  const fb = a => Either.Left(a + 2);
  const g = a => Either.Right(a * 2);
  const ma = Either.Right(2);
  const mb = Either.Left(2);
  const a = 2;

  test("Left identity rule for Monads (Right). return a >>= f ≡ f a", () => {
    const left_exp = Either.mReturn(a).mBind(fa);
    const right_exp = fa(a)
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Left identity rule for Monads (Left). return a >>= f ≡ f a", () => {
    const left_exp = Either.mReturn(a).mBind(fb);
    const right_exp = fb(a)
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Right identity rule for Monads (Right). m >>= return ≡ m", () => {
    const left_exp = ma.mBind(Either.mReturn);
    const right_exp = ma
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Right identity rule for Monads (Left). m >>= return ≡ m", () => {
    const left_exp = mb.mBind(Either.mReturn);
    const right_exp = mb
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Associatitity rule for Monads (Right). (m >>= f) >>= g ≡ m >>= (\\x -> f x >>= g)", () => {
    const left_exp = ma.mBind(fa).mBind(g)
    const right_exp = ma.mBind(x => fa(x).mBind(g))
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Associatitity rule for Monads (Left). (m >>= f) >>= g ≡ m >>= (\\x -> f x >>= g)", () => {
    const left_exp = ma.mBind(fb).mBind(g)
    const right_exp = ma.mBind(x => fb(x).mBind(g))
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

});