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

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Basic closure DI
 * Doesn't programmatically communicate with an injector
 */
function doClosureStuffInjector(Logger) {
  const logger = new Logger('closureInjector')

  return function doClosureStuff() {
    logger.log('Function injected via closure!');
  };
}

// App Bootstrapping
var doClosureStuff = doClosureStuffInjector(Logger);
doClosureStuff();

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
  this.Logger.log('SetterPrototypeComponent!');
};

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
  var logger = new Logger('angularJsFunction');
  logger.log('calling function!');
  logger.log(param0);
}

function angularJsInjector(dependencies, fn) {
  var fnDependencies = fn.$inject || [];
  var $inject = fnDependencies.slice(0);

  while (fnDependencies.length > 0) {
    var dependencyName = fnDependencies.shift();
    if (!dependencies[dependencyName]) {
      throw new Error('Dependency "' + dependencyName + '" is not a valid dependency.');
    }
    fn = fn.bind(null, dependencies[dependencyName]);
  }

  fn.$inject = $inject;
  return fn;
}

function angularJsContext(dependencies) {
  var functions = {
    angularJsFunction: angularJsFunction,
  };

  Object.keys(functions).forEach(function (key) {
    functions[key] = angularJsInjector(dependencies, functions[key]);
  });

  return functions;
}

var angularJsFunctions = angularJsContext({
  Logger: Logger
});

angularJsFunctions.angularJsFunction('injected with string abstractions!');

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Symfony style IOC containers
 */
function ContainerReference(containerName) {
  this.containerName = containerName;
}

function SymfonyContainer(containerBuilder, className, args) {
  this.containerBuilder = containerBuilder;
  this.className = className;
  this.arguments = args.map(function (arg) {
    return {
      name: arg
    };
  });
}
SymfonyContainer.prototype.getNextEmptyArgument = function getNextEmptyArgument() {
  return this.dependencies.find(function (dependency) {
    return typeof dependency.value === 'undefined';
  });
};
SymfonyContainer.prototype.addArgument = function addArgument(value) {
  var argument = this.getNextEmptyArgument();
  if (
    typeof value === 'string' &&
    value[0] === '%' &&
    value[value.length - 1] === '%'
  ) {
    var parameterName = value.substring(1, value.length - 2);
    if (!this.containerBuilder.parameters[parameterName]) {
      throw new Error('Parameter "' + parameterName + '" is not a valid parameter.');
    }
    argument.value = this.containerBuilder.parameters[parameterName];
    return this;
  }

  if (value instanceof ContainerReference) {
    argument.value = this.containerBuilder.get(value.containerName);
    return this;
  }

  argument.value = value;
  return this;
};
SymfonyContainer.prototype.addMethodCall = function addMethodCall(methodName, parameters) {
  throw new Error('NotYetImplementedException');
};

function ContainerBuilder(classes) {
  this.classes = classes;
  this.containers = {};
  this.parameters = {};
}
ContainerBuilder.prototype.register = function register(instanceName, className) {
  var args = [].slice.call(arguments, 0);
  containers[instanceName] = new SymfonyContainer(this, className, args);
  
  return containers[instanceName];
};
SymfonyContainer.prototype.setParameter = function setParameter(name, value) {
  this.parameters[name] = value;
  return this;
};
ContainerBuilder.prototype.get = function get(name) {
  return this.containers[name];
};

function SymfonyClass(logger) {
  this.logger = logger;
}
SymfonyClass.prototype.doLogging = function doLogging() {
  this.logger.log('Logging from a symfony IOC container!');
};

var containerBuilder = new ContainerBuilder({
  Logger: Logger,
  SymfonyClass: SymfonyClass
});

containerBuilder.setParameter('logger.namespace', 'SymfonyIOC');
containerBuilder
  .register('logger', 'Logger')
  .addArgument('%logger.namespace%');

containerBuilder
  .register('symfonyClass', 'SymfonyClass')
  .addArgument(new ContainerReference('logger'));

// Handles app boostrapping, could be done somewhere else too
// TODO: Get this to instantiate classes
containerBuilder.bootstrap();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
function springFunction() {

}
