/* eslint-disable no-undef */
function SymfonyClass(logger) {
  this.logger = logger;
}
SymfonyClass.prototype.doLogging = function doLogging() {
  this.logger.log('Logging from a symfony IOC container!');
};

var containerBuilder = new ContainerBuilder({
  ExampleLogger: ExampleLogger,
  SymfonyClass: SymfonyClass
});

containerBuilder.setParameter('logger.namespace', 'SymfonyIOC');

containerBuilder
  .register('logger', 'ExampleLogger')
  .addArgument('%logger.namespace%')
  .addArgument('symfonyLog');

containerBuilder
  .register('symfonyClass', 'SymfonyClass')
  .addArgument(new ContainerReference('logger'));

// Lazy instantiated containers only get injected when .get() is called
// This makes everything a Singleton, but could be adjusted to get classes themselves
// It would be recommended to get the container instances at app bootstrapping only
var symfonyClass = containerBuilder.get('symfonyClass');
