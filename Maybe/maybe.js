const commonFns = require('../common_functions')

//Value Constructors

const Maybe = {
    Just: (value) => ({
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
    
        valueOf: () => value,
      
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
        fmap: fn => Maybe.Nothing(),
    
        valueOf: () => undefined,
        //Making Maybe.Nothing an instance of Monad
        mBind: fn => Maybe.Nothing(),
        getType: () => "Nothing"
    }),
    mReturn: value => Maybe.Just(value),

    //Making Maybe.Just an instance of Monoid
    mempty: () => Maybe.Nothing()
}

module.exports = Maybe;