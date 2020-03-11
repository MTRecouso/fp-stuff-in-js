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

module.exports = {Left, Right, either}

//Testing it with a few functions

const add2Either = (a) =>{
    try{
        if(a === undefined)
            throw new Error("Value of a is not defined");
        return Right(a + 2);
    }
    catch(e){
        return Left(e);
    }
}

const multiply2Either = (a) =>{
    try{
        return Right(a * 2);
    }
    catch(e){
        return Left(e)
    }
}

console.log(Right(undefined).mBind(add2Either).mBind(multiply2Either).valueOf());

console.log(Right(3).mBind(add2Either).mBind(multiply2Either).valueOf());

/*
Proving that it satisfies the monadic laws
 
Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftId = (f,a) => Right().mReturn(a).mBind(f).valueOf() === f(a).valueOf()

const rightId = (m) => m.mBind(Right().mReturn).valueOf() === m.valueOf();

const associativity = (m,f,g) => m.mBind(f).mBind(g).valueOf() ===  m.mBind((x) => f(x).mBind(g)).valueOf();

console.log(leftId(add2Either,2))

console.log(rightId(Right(4)));

console.log(associativity(Right(4),add2Either,multiply2Either));