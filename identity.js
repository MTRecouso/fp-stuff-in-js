const commonFns = require('./common_functions')


//Value Constructor

const Identity = (value) => ({
  valueOf: () => value,

  //Making Identity an instance of Monoid
  mappend: (mb) => Identity(commonFns.mappend(value, mb.valueOf())),

  mempty: () => Identity({mempty: true}),
    
  //Making Identity an instance of Functor
  fmap: fn => Identity(fn(value)),

  //Making Identity an instance of Monad

  mBind: fn => fn(value),
  mReturn: (value) => Identity(value)
})


console.log(Identity(4).mappend(Identity(7)).valueOf());

console.log(Identity({a: "aaa", b:"gggg"}).mappend(Identity({c: "ssss", d: "ggggg"})).valueOf());

console.log(Identity((a) => a + 2).mappend(Identity((b) => b + 3)).valueOf()(5));

console.log(Identity((a) => a + 9).mappend(Identity().mempty()).valueOf()(5));

console.log(Identity(true).mappend(Identity(true)).valueOf())

//Proving that it satisfies the Monoid laws

/*
  Right identity: x <> mempty = x
  Left identity: mempty <> x = x
  Associativity: (x <> y) <> z = x <> (y <> z)
*/

const monoidRightId = x => x.mappend(Identity().mempty()).valueOf() === x.valueOf();

const monoidLeftId = (x) => Identity().mempty().mappend(x).valueOf() === x.valueOf();

const monoidAssociativity = (x,y,z) => x.mappend(y).mappend(z).valueOf() === x.mappend(y.mappend(z)).valueOf(); 


console.log('Monoid left identity', monoidLeftId(Identity(5)))

console.log('Monoid right identity', monoidRightId(Identity(2)));

console.log('Monoid associativity', monoidAssociativity(Identity(2), Identity(5), Identity(7)));

//Proving that it satisfies the Functor laws

/*
  Identity:  fmap id = id
  Composition: fmap f . g = fmap f . fmap g
*/

const functorIdentity = fa => fa.fmap(a=>a).valueOf() === fa.valueOf();

const functorComposition = (fa,f,g) => fa.fmap((commonFns.compose(f,g))).valueOf() === fa.fmap(f).fmap(g).valueOf();

console.log('identity',functorIdentity(Identity(6)))
console.log('composition ', functorComposition(Identity(6),a => a + 5, b => b + 7))


//Testing it with a few functions

const add2 = (a) => Identity(a + 2);

const multiply2 = (a) => Identity(a * 2);

console.log(Identity(2).mBind(add2).mBind(multiply2).valueOf());

/*
Proving that it satisfies the monadic laws:

Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftId = (f,a) => Identity().mReturn(a).mBind(f).valueOf() === f(a).valueOf()

const rightId = (m) => m.mBind(m.mReturn).valueOf() === m.valueOf();

const associativity = (m,f,g) => m.mBind(f).mBind(g).valueOf() ===  m.mBind((x) => f(x).mBind(g)).valueOf();

console.log('left identity', leftId(add2,2))

console.log('right identity', rightId(Identity(2)));

console.log('associativity', associativity(Identity(2),add2,multiply2));








