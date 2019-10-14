// Since we're not using spread syntax, we have to do some fancy footwork with partial application
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Apply_for_new
function applyAndNew(constructor, args) {
  function partial() {
    return constructor.apply(this, args);
  }
  if (typeof constructor.prototype === 'object') {
    partial.prototype = Object.create(constructor.prototype);
  }
  return partial;
}
