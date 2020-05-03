exports.compose = fnb => fna => value =>
  fnb(fna(value))

exports.trace = x => {
  console.log(x);
  return x;
};

exports.mappend = (a, b) => {
  if(a.mempty === true){
    return this.mappend(_mempty(b), b);
  }
  else{
    if(b.mempty === true){
      return this.mappend(a, _mempty(a));
    }
  }
  const primitive_type = typeof a;
  switch (primitive_type) {
    case "string":
      return a.concat(b);
    case "number":
      return a + b;
    case "object":
      return Object.assign(a, b);
    case "boolean":
      return a && b;
    case "function":
      return x => this.mappend(a(x), b(x));
  }
};

const _mempty = (a) => {
  const primitive_type = typeof a;
  switch (primitive_type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "object":
      return {};
    case "boolean":
      return true;
    case "function":
      return _mempty;
  }
};