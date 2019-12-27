/* eslint-disable no-undef */
function SetterPrototypeComponent(name, loggerId) {
  this.name = name;
  this.loggerId = loggerId;
}
SetterPrototypeComponent.prototype.getDependencies = function getDependencies() {
  return ['Logger'];
};
SetterPrototypeComponent.prototype.setLogger = function setLogger(logger) {
  this.logger = logger;
  this.logger.setNamespace(this.name);
  this.logger.setId(this.loggerId);
};
SetterPrototypeComponent.prototype.doLogging = function doLogging() {
  this.logger.log('SetterPrototypeComponent!');
};

// App Bootstrapping
var injectDependencies = createInjector({
  Logger: ExampleLogger
});
var setterPrototypeComponent = new SetterPrototypeComponent('mySetterPrototype', 'setterPrototypeLog');
injectDependencies(setterPrototypeComponent);