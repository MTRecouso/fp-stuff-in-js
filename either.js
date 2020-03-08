const commonFns = require('./common_functions')

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

//Implementing function either

const either = (fa,fb,e) => e.getType() === "Left" ? fa(e.valueOf()) : fb(e.valueOf());

console.log(either((a) => a.length,(a) => a * 3,Right(6)));

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


//Proving that it satisfies the Semigroup law

/*
  Associativity: (x <> y) <> z = x <> (y <> z)
*/

const semigroupAssociativity = (x,y,z) => x.mappend(y).mappend(z).valueOf() === x.mappend(y.mappend(z)).valueOf(); 

console.log('Semigroup associativity', semigroupAssociativity(Left(2), Left(5), Right(7)));

//Proving that it satisfies the Functor laws

/*
  Identity:  fmap id = id
  Composition: fmap f . g = fmap f . fmap g
*/

const functorIdentity = fa => fa.fmap(a=>a).valueOf() === fa.valueOf();

const functorComposition = (fa,f,g) => fa.fmap((commonFns.compose(f,g))).valueOf() === fa.fmap(f).fmap(g).valueOf();

console.log('identity',functorIdentity(Right(6)));
console.log('composition ', functorComposition(Right(8),a => a + 5, b => b + 7));

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