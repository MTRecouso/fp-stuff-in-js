exports.compose = (...fns) => value => fns.reduceRight((prevFn,currentFn) => currentFn(prevFn(value)))

exports.trace = x => {
    console.log(x);
    return x;
  };