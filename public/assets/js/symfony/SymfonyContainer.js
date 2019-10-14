function SymfonyContainer(containerBuilder, className, classProto) {
  this.containerBuilder = containerBuilder;
  this.className = className;
  this.classProto = classProto;
  this.instance = null;
  this.arguments = [];
}
SymfonyContainer.prototype.addArgument = function addArgument(value) {
  var argument;
  if (
    typeof value === 'string' &&
    value[0] === '%' &&
    value[value.length - 1] === '%'
  ) {
    var parameterName = value.substring(1, value.length - 1);
    if (!this.containerBuilder.parameters[parameterName]) {
      throw new Error('Parameter "' + parameterName + '" is not a valid parameter.');
    }
    argument = this.containerBuilder.parameters[parameterName];
    this.arguments.push(argument);
    return this;
  }

  if (value instanceof ContainerReference) {
    argument = this.containerBuilder.get(value.containerName);
    this.arguments.push(argument);
    return this;
  }

  argument = value;
  this.arguments.push(argument);
  return this;
};
// TODO: Implement addMethodCall
SymfonyContainer.prototype.addMethodCall = function addMethodCall(methodName, parameters) {
  throw new Error('NotYetImplementedException');
};
SymfonyContainer.prototype.build = function build() {
  if (this.instance) {
    return this;
  }

  var appliedClass = applyAndNew(this.classProto, this.arguments);
  this.instance = new appliedClass;
  // in ES6
  // this.instance = new this.classProto(...this.arguments);
};
