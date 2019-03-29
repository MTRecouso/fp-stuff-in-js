//Value Constructors

function Just(value){
    if(!(this instanceof Just))
        return new Just(value)
    this.value=value
}

function Nothing(){
    if(!(this instanceof Nothing))
        return new Nothing();
}

//Making Maybe an instance of Monad

const maybeReturn = (a) => Just(a)

const maybeBind = (ma, fn) => {
    if(ma instanceof Nothing || ma.value===null || ma.value===undefined){
        return Nothing()
    }
    return fn(ma.value)
} 

//Testing it with a few functions

const addUndefined = (a) => Just(null)

const add2Maybe = (a) => Just(a + 2);

const multiply2Maybe = (a) => Just(a * 2);

console.log(maybeBind(maybeBind(Just(3),addUndefined),multiply2Maybe));

/*
Proving that it satisfies the monadic laws
 
Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftIdMaybe = (f,a) => JSON.stringify(maybeBind(maybeReturn(a),f)) === JSON.stringify(f(a))

const rightIdMaybe = (m) => JSON.stringify(maybeBind(m, maybeReturn)) === JSON.stringify(m);

const associativityMaybe = (m,f,g) => JSON.stringify(maybeBind(maybeBind(m,f),g)) ===  JSON.stringify(maybeBind(m,((x) => maybeBind(f(x),g)))) 

console.log(leftIdMaybe(add2Maybe,2))

console.log(rightIdMaybe(Nothing()));

console.log(associativityMaybe(Nothing(),add2Maybe,multiply2Maybe))
