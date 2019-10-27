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

function injectAngularJsContext(dependencies) {
  var context = {
    angularJsFunction: angularJsFunction,
  };

  Object.keys(context).forEach(function (key) {
    context[key] = angularJsInjector(dependencies, context[key]);
  });

  return context;
}
