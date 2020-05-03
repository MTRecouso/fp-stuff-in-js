const commonFns = require('../common_functions')

//Value Constructors

const Maybe = {
    Just: (value) => ({
        valueOf: () => value,
        //Making Maybe.Just an instance of Semigroup
        mappend: (mb) => {
            if(mb.getType() === 'Nothing'){
                return Maybe.Just(value)
            }
            else{
                return Maybe.Just(commonFns.mappend(value, mb.valueOf()))
            }
        },      
        //Making Maybe.Just an instance of Functor
        fmap: fn => Maybe.Just(fn(value)), 

        //Making Maybe.Just an instance of Apply
        liftF2: fb => {
            if(fb.getType() === 'Just'){
                return Maybe.Just(fb.valueOf()(value))
            }
            else{
                return Maybe.Nothing()
            }
        },   
        //Making Maybe.Just an instance of Monad
        mBind: fn =>  {
            if(value===null || value===undefined){
                return Maybe.Nothing()
            }
            return fn(value)
        },
        getType: () => "Just",
    }),
    Nothing: () => ({
        //Making Maybe.Nothing an instance of Semigroup
        mappend: (mb) => mb,
        //Making Maybe.Nothing an instance of Functor
        fmap: _ => Maybe.Nothing(),
        //Making Maybe.Nothing an instance of Apply
        liftF2: _ => Maybe.Nothing(),
        valueOf: () => undefined,
        //Making Maybe.Nothing an instance of Monad
        mBind: _ => Maybe.Nothing(),
        getType: () => "Nothing"
    }),
    //Making Maybe an instance of Applicative
    mReturn: value => Maybe.Just(value),
    //Making Maybe an instance of Monoid
    mempty: () => Maybe.Nothing()
}

module.exports = Maybe;