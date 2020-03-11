const commonFns = require('../common_functions')

//Value Constructor

const Identity = (value) => ({
  valueOf: () => value,

  //Making Identity an instance of Semigroup
  mappend: (mb) => Identity(commonFns.mappend(value, mb.valueOf())),

  //Making Identity an instance of Monoid
  mempty: () => Identity({mempty: true}),
    
  //Making Identity an instance of Functor
  fmap: fn => Identity(fn(value)),

  //Making Identity an instance of Monad

  mBind: fn => fn(value),
  mReturn: (value) => Identity(value)
})

module.exports = Identity

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








