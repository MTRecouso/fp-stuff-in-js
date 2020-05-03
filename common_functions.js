exports.compose = fnb => fna => value =>
  fnb(fna(value))

exports.composeMany = (...fns) => value =>
  fns.reduceRight((x, fn) => fn(x), value)

exports.pipe = (...fns) => value =>
  fns.reduce((x, fn) => fn(x), value)

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
      return _objectMappend(a, b);
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

const _objectMappend = (a, b) => {
  const a_with_mappends = Object.keys(a).reduce((result_obj, obj_key) => {
    if(b.hasOwnProperty(obj_key)){
      result_obj[obj_key] = this.mappend(a[obj_key], b[obj_key]);
    }
    else{
      result_obj[obj_key] = a[obj_key];
    }
    return result_obj;
  }, {});
  return Object.assign({},b, a_with_mappends)
}