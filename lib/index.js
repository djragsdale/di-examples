/**
 * Logger dependency
 */
function Logger(namespace) {
  this.namespace = namespace;
}

Logger.prototype.log = function log(message) {
  if (this.namespace) {
    console.log(namespace + ': ' + message);
    return;
  }

  console.log(message);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Basic closure DI
 * Doesn't programmatically communicate with an injector
 */
function closureFunction(Logger) {
  return function (param0) {

  };
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Basic property-setter DI
 * Leverages a string abstraction
 */
function SetterPrototypeComponent(name) {
  this.name = name;
}
SetterPrototypeComponent.prototype.getDependencies = function getDependencies() {
  return ['Logger'];
};
SetterPrototypeComponent.prototype.setLogger = function setLogger(Logger) {
  this.Logger = new Logger(this.name);
};
SetterPrototypeComponent.prototype.doLogging = function doLogging() {
  this.Logger
}

// Accepts dependencies object
function createInjector(dependencies) {
  // Dependencies needing dependencies might need to be done out of order

  return function setterPrototypeInjector(instance) {
    var requestedDependencies = instance.getDependencies();
    requestedDependencies.forEach(function (dependencyName) {
      if (!dependencies[dependencyName]) {
        throw new Error('Dependency "' + dependencyName + '" is not a valid dependency.');
      }

      if (!instance['set' + dependencyName]) {
        throw new Error('prototype missing dependency setter "set' + dependencyName + '"');
      }

      instance['set' + dependencyName](dependencies[dependencyName]);
    });
  }
}

// App Bootstrapping
var injectDependencies = createInjector({
  Logger: Logger
});

var setterPrototypeComponent = new SetterPrototypeComponent('mySetterPrototype');
injectDependencies(setterPrototypeComponent);
setterPrototypeComponent.doLogging();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * AngularJS style DI
 * Leverages a string abstraction
 */
angularJsFunction.$inject = ['Logger'];
function angularJsFunction(Logger, param0) {

}

function angularJsContext() {
  var functions = {
    angularJsFunction: angularJsFunction,
  };

  Object.keys(functions).forEach(function (key) {
    var fn = functions[key];
  });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
function symfonyFunction() {

}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
function springFunction() {

}
