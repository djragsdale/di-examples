function ContainerBuilder(classes) {
  this.classes = classes;
  this.containers = {};
  this.parameters = {};
}
ContainerBuilder.prototype.register = function register(instanceName, className) {
  this.containers[instanceName] = new SymfonyContainer(this, className, this.classes[className]);

  return this.containers[instanceName];
};
ContainerBuilder.prototype.setParameter = function setParameter(name, value) {
  this.parameters[name] = value;
  return this;
};
// Bootstrap a container when it is requested
ContainerBuilder.prototype.get = function get(name) {
  this.containers[name].build();
  return this.containers[name].instance;
};
ContainerBuilder.prototype.getClass = function getClass(name) {
  return this.classes[name];
};
