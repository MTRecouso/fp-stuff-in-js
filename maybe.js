const commonFns = require('./common_functions')

//Value Constructors

const Just = (value) => ({

    fmap: fn => Just(fn(value)), 

    valueOf: () => value,
  
    //Making Just an instance of Monad
    mBind: fn =>  {
        if(value===null || value===undefined){
            return Nothing()
        }
        return fn(value)
    },
    mReturn: value => Just(value)
})

const Nothing = () => ({
    fmap: fn => Nothing(),

    valueOf: () => undefined,
    //Making Nothing an instance of Monad
    mBind: fn => Nothing(),
    /*
        Return is not implemented in this case since it is supposed to recieve a value
        and return Just(value) in the Applicative (since return = pure) instance from Maybe
    */
})

//Testing it with a few functions

const addUndefined = (a) => Just(null)

const add2Maybe = (a) => Just(a + 2);

const multiply2Maybe = (a) => Just(a * 2);

console.log(Just(3).mBind(add2Maybe).mBind(multiply2Maybe).valueOf());

console.log(Just(null).mBind(add2Maybe).mBind(multiply2Maybe).valueOf());


//Proving that it satisfies the Functor laws

/*
  Identity:  fmap id = id
  Composition: fmap f . g = fmap f . fmap g
*/

const functorIdentity = fa => fa.fmap(a=>a).valueOf() === fa.valueOf();

const functorComposition = (fa,f,g) => fa.fmap((commonFns.compose(f,g))).valueOf() === fa.fmap(f).fmap(g).valueOf();

console.log('identity',functorIdentity(Just(6)));
console.log('composition ', functorComposition(Just(8),a => a + 5, b => b + 7));


/*
Proving that it satisfies the monadic laws
 
Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftId = (f,a) => Just().mReturn(a).mBind(f).valueOf() === f(a).valueOf()

const rightId = (m) => m.mBind(Just().mReturn).valueOf() === m.valueOf();

const associativity = (m,f,g) => m.mBind(f).mBind(g).valueOf() ===  m.mBind((x) => f(x).mBind(g)).valueOf();


console.log(leftId(add2Maybe,2))

console.log(rightId(Nothing()));

console.log(associativity(Nothing(),add2Maybe,multiply2Maybe))
