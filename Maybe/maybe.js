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

module.exports = Maybe


//Proving that it satisfies the Functor laws

/*
  Identity:  fmap id = id
  Composition: fmap f . g = fmap f . fmap g
*/

const functorIdentity = fa => fa.fmap(a=>a).valueOf() === fa.valueOf();

const functorComposition = (fa,f,g) => fa.fmap((commonFns.compose(f,g))).valueOf() === fa.fmap(f).fmap(g).valueOf();

console.log('identity',functorIdentity(Maybe.Just(6)));
console.log('composition ', functorComposition(Maybe.Just(4),a => a + 5, b => b + 7));


/*
Proving that it satisfies the monadic laws
 
Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftId = (f,a) => Maybe.mReturn(a).mBind(f).valueOf() === f(a).valueOf()

const rightId = (m) => m.mBind(Maybe.mReturn).valueOf() === m.valueOf();

const associativity = (m,f,g) => m.mBind(f).mBind(g).valueOf() ===  m.mBind((x) => f(x).mBind(g)).valueOf();


console.log(leftId(add2Maybe,2))

console.log(rightId(Maybe.Nothing()));

console.log(associativity(Maybe.Nothing(),add2Maybe,multiply2Maybe))
