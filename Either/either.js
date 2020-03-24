//Value Constructors

const Either = {
    Right: (value) => ({
        valueOf: () => value,

        //Making Right an instance of Semigroup
        mappend: mb => Either.Right(value),

        //Making Right an instance of Functor
        fmap: fn => Either.Right(fn(value)), 


    
        //Making Right an instance of Monad 
        mBind: fn => fn(value),
        getType: () => "Right"
    }),

    Left: (value) => ({
        valueOf: () => value,

        //Making Right an instance of Semigroup
        mappend: mb => mb,
  
        //Making Left an instance of Functor
        fmap: _ => Either.Left(value),  

        //Making Left an instance of Monad 
        mBind: _ => Either.Left(value),  

        getType: () => "Left"
    }),
    //Making Either an instance of Applicatives
    mReturn: (value) => Either.Right(value)
};

const either = (fa,fb,e) => e.getType() === "Left" ? fa(e.valueOf()) : fb(e.valueOf());

module.exports = {Either, either};