//Value Constructors

function Left(value){
    if(!(this instanceof Left))
        return new Left(value)
    this.value=value
}

function Right(value){
    if(!(this instanceof Right))
        return new Right(value)
    this.value=value
}

//Implementing function either

const either = (fa,fb,e) => e instanceof Left ? fa(e.value) : fb(e.value);

console.log(either((a) => a.length,(a) => a * 3,Right(6)))

//Making Either an instance of Monad

const eitherReturn = (a) => Right(a)

const eitherBind = (ma, fn) => {
    if(ma instanceof Left){
        return Left(ma.value)
    }
    return fn(ma.value)
}

//Testing it with a few functions

const add2Either = (a) =>{
    try{
        if(a === undefined)
            throw new Error()
        return Right(a + 2);
    }
    catch(e){
        return Left(e)
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

console.log(eitherBind(eitherBind(Right(undefined),add2Either),multiply2Either));

console.log(eitherBind(eitherBind(Right(3),add2Either),multiply2Either));

/*
Proving that it satisfies the monadic laws
 
Left identity: return a >>= f ≡ f a

Right identity: m >>= return ≡ m

Associativity: (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g) 
*/

const leftIdEither = (f,a) => JSON.stringify(eitherBind(eitherReturn(a),f)) === JSON.stringify(f(a))

const rightIdEither = (m) => JSON.stringify(eitherBind(m, maybeReturn)) === JSON.stringify(m);

const associativityEither = (m,f,g) => JSON.stringify(eitherBind(eitherBind(m,f),g)) ===  JSON.stringify(eitherBind(m,((x) => eitherBind(f(x),g)))) 

console.log(leftIdEither(add2Either,2))

console.log(rightIdEither(Right(4)));

console.log(associativityEither(Right(4),add2Either,multiply2Either));