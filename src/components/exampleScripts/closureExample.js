/* eslint-disable no-undef */
function doClosureStuffInjector(logger) {
  return function doClosureStuff() {
    logger.log('Function injected via closure!');
  };
}

// App Bootstrapping
var doClosureStuff = doClosureStuffInjector(new ExampleLogger('closureInjector', 'closureLog'));
