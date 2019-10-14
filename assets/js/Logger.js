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
