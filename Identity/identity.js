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

  //Making Identity an instance of Apply
  liftF2: fb => Identity(fb.valueOf()(value)),

  //Making Identity an instance of Applicative
  mReturn: (value) => Identity(value),

  //Making Identity an instance of Monad
  mBind: fn => fn(value),
})

module.exports = Identity








