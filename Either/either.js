const commonFns = require('../common_functions')

//Value Constructors

const Right = (value) => ({
    valueOf: () => value,

    //Making Right an instance of Semigroup
    mappend: mb => Right(value),

    //Making Right an instance of Functor
    fmap: fn => Right(fn(value)), 
  
    //Making Right an instance of Monad 
    mBind: fn => fn(value),
    mReturn: (value) => Right(value),
    getType: () => "Right"
});

const Left = (value) => ({
    valueOf: () => value,

    //Making Right an instance of Semigroup
    mappend: mb => mb,
  
    //Making Left an instance of Functor
    fmap: _ => Left(value),  

    //Making Left an instance of Monad 
    mBind: _ => Left(value),  
    /*
        Return is not implemented in this case since it is supposed to recieve a value
        and return Right(value) in the Applicative (since return = pure) instance from Either
    */
   getType: () => "Left"
});

const either = (fa,fb,e) => e.getType() === "Left" ? fa(e.valueOf()) : fb(e.valueOf());

module.exports = {Left, Right, either};