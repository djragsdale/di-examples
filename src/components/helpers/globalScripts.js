/**
 * Logger dependency
 */
function Logger(namespace) {
  this.setNamespace(namespace);
}
Logger.prototype.setNamespace = function setNamespace(namespace) {
  this.namespace = namespace;
};
Logger.prototype.log = function log(message) {
  if (this.namespace) {
    console.log(this.namespace + ': ' + message);
    return;
  }

  console.log(message);
};

function ExampleLogger(namespace, id) {
  this.lines = [];
  this.threshold = 100;
  if (namespace) {
    this.setNamespace(namespace);
  }
  if (id) {
    this.setId(id);
  }
}
ExampleLogger.prototype = Object.create(Logger.prototype);
ExampleLogger.prototype.constructor = Logger;
ExampleLogger.prototype.setId = function setId(id) {
  this.id = id;
};
ExampleLogger.prototype.setNamespace = function setNamespace(namespace) {
  this.namespace = namespace;
};
ExampleLogger.prototype.log = function log(message) {
  var formattedMessage = message;
  if (this.namespace) {
    formattedMessage = this.namespace + ': ' + message;
  }

  console.log(formattedMessage);

  this.lines.unshift(formattedMessage);

  // Doesn't currently protect against message containing \\n
  if (this.lines.length > this.threshold) {
    this.lines.pop();
  }

  var element = document.querySelector('#' + this.id);
  if (!element) {
    throw new Error('ExampleLogger cannot find element with id "' + this.id + '"');
  }
  element.innerText = this.lines.join('\n');
};



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