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

//Testing it with a few functions

const addUndefined = (a) => Maybe.Just(null)

const add2Maybe = (a) => Maybe.Just(a + 2);

const multiply2Maybe = (a) => Maybe.Just(a * 2);

console.log(Maybe.Just(3).mBind(add2Maybe).mBind(multiply2Maybe).valueOf());

console.log(Maybe.Just(null).mBind(add2Maybe).mBind(multiply2Maybe).valueOf());


//Proving that it satisfies the Monoid laws

/*
  Right identity: x <> mempty = x
  Left identity: mempty <> x = x
  Associativity: (x <> y) <> z = x <> (y <> z)
*/

const monoidRightId = x => x.mappend(Maybe.mempty()).valueOf() === x.valueOf();

const monoidLeftId = (x) => Maybe.mempty().mappend(x).valueOf() === x.valueOf();

const monoidAssociativity = (x,y,z) => x.mappend(y).mappend(z).valueOf() === x.mappend(y.mappend(z)).valueOf(); 

console.log('Monoid left identity', monoidLeftId(Maybe.Just(5)))

console.log('Monoid right identity', monoidRightId(Maybe.Just(2)));

console.log('Monoid associativity', monoidAssociativity(Maybe.Just(2), Maybe.Just(5), Maybe.Just(7)));

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
