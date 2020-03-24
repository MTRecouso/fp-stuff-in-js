const {Left, Right, either} = require("./either");
const { compose } = require("../common_functions");

describe("Tests of function either", () => {
    test("Should unwrap Left and apply the first param function", () => {
        either((a) => a.length,(a) => a * 3,Left(6))
    });

    test("Should unwrap Right and apply the second param function", () => {
        either((a) => a.length,(a) => a * 3,Right(6))
    });
})

describe("Semigroup implementation for Either", () => {
  test("Mappend of two Right returns the first param", () => {
    expect(
      Right(4)
        .mappend(Right(7))
        .valueOf()
    ).toBe(4);
  });

  test("Mappend of a Left with a Right returns the second param", () => {
    expect(
      Left(4)
        .mappend(Right(7))
        .valueOf()
    ).toBe(7);
  });

  test("Mappend of two Left returns the second param", () => {
    expect(
      Left(4)
        .mappend(Left(7))
        .valueOf()
    ).toBe(7);
  });

  test("Associativity rule for Semigroups. (x <> y) <> z = x <> (y <> z)", () => {
    const x = Right(2);
    const y = Right(5);
    const z = Right(7);
    const rightPrecedenceMappend = x
      .mappend(y)
      .mappend(z)
      .valueOf();
    const leftPrecedenceMappend = x.mappend(y.mappend(z)).valueOf();
    expect(rightPrecedenceMappend).toBe(leftPrecedenceMappend);
  });
});

describe("Functor implementation for Either", () => {
    const fa = Right(2);
    const fb = Left(2);
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

describe("Monad implementation for Either", () => {
  const fa = a => Right(a + 2);
  const fb = a => Left(a + 2);
  const g = a => Right(a * 2);
  const ma = Right(2);
  const mb = Left(2);
  const a = 2;

  test("Left identity rule for Monads (Right). return a >>= f ≡ f a", () => {
    const left_exp = Right().mReturn(a).mBind(fa);
    const right_exp = fa(a)
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Left identity rule for Monads (Left). return a >>= f ≡ f a", () => {
    const left_exp = Right().mReturn(a).mBind(fb);
    const right_exp = fb(a)
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Right identity rule for Monads (Right). m >>= return ≡ m", () => {
    const left_exp = ma.mBind(ma.mReturn);
    const right_exp = ma
    expect(left_exp.valueOf()).toBe(right_exp.valueOf());
    expect(left_exp.getType()).toBe(right_exp.getType());
  });

  test("Right identity rule for Monads (Left). m >>= return ≡ m", () => {
    const left_exp = mb.mBind(Right().mReturn);
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