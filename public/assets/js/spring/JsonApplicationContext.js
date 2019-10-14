function JsonApplicationContext(notBean) {
  this.instances = {};
  var self = this;

  function createDependency(name, config) {
    // TODO: Upgrade to handle scope=singleton properly
    if (self.instances[name]) {
      return self.instances[name];
    }

    if (!config.proto) {
      throw new Error('Dependency "' + name + '" is missing field "proto".');
    }

    var args = [];
    if (config.constructorArgs) {
      // Iterate through config.constructorArgs and recursively call createDependency until they're all ready.

      config.constructorArgs.forEach(function (arg) {
        if (arg.ref) {
          args.push(createDependency(arg.ref, notBean[arg.ref]));
        } else {
          args.push(arg.value);
        }
      });

      var appliedClass = applyAndNew(config.proto, args);
      self.instances[name] = new appliedClass;
      return self.instances[name];
    }

    self.instances[name] = new config.proto();

    if (config.properties) {
      config.properties.forEach(function (prop) {
        var firstLetter = prop.name.slice(0, 1);
        var methodName = 'set' + firstLetter.toUpperCase() + prop.name.slice(1);

        var value;
        if (prop.ref) {
          value = createDependency(prop.ref, notBean[prop.ref]);
        } else {
          value = prop.value;
        }

        self.instances[name][methodName](value);
      });
    }

    return self.instances[name];
  }

  Object.keys(notBean).forEach(function (dependencyName) {
    createDependency(dependencyName, notBean[dependencyName]);
  });
}
JsonApplicationContext.prototype.getBean = function getBean(name) {
  if (!this.instances[name]) {
    throw new Error('Dependency "' + name + '" is not a valid dependency.');
  }

  return this.instances[name];
};
