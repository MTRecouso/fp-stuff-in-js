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
        expect(fa.fmap(compose(add3, add5)).valueOf()).toBe(
        fa
            .fmap(add3)
            .fmap(add5)
            .valueOf()
        );
    });

    test("Composition rule for Functors (Left). fmap f . g = fmap f . fmap g", () => {
        expect(fb.fmap(compose(add3, add5)).valueOf()).toBe(
        fb
            .fmap(add3)
            .fmap(add5)
            .valueOf()
        );
    });

})