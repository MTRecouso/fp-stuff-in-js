//Value Constructor

function Identity(value){
    if(!(this instanceof Identity))
        return new Identity(value)
    this.value=value;
}

//Making Identity an instance of Monad

const identityBind = (ma, fn) => fn(ma.value);

const identityReturn = (a) => Identity(a);

//Testing it with a few functions

const add2 = (a) => Identity(a + 2);

const multiply2 = (a) => Identity(a * 2);

identityBind(identityBind(Identity(2),add2),multiply2);

/*
Proving that it satisfies the monadic laws:

Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftId = (f,a) => JSON.stringify(identityBind(identityReturn(a),f)) === JSON.stringify(f(a))

const rightId = (m) => JSON.stringify(identityBind(m, identityReturn)) === JSON.stringify(m);

const associativity = (m,f,g) => JSON.stringify(identityBind(identityBind(m,f),g)) ===  JSON.stringify(identityBind(m,((x) => identityBind(f(x),g)))) 

console.log(leftId(add2,2))

console.log(rightId(Identity(2)));

console.log(associativity(Identity(2),add2,multiply2));








