/* eslint-disable no-undef */
angularJsFunction.$inject = ['logger'];
function angularJsFunction(logger, param0) {
  var logger = logger;
  logger.log('injected using string abstractions!');
}

// App Bootstrapping
var angularJsContext = injectAngularJsContext({
  logger: new ExampleLogger('angularJsFunction', 'angularJsLog'),
});