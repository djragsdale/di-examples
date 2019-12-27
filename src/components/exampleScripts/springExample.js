/* eslint-disable no-undef */
function SpringClass(logger) {
  this.logger = logger;
  // Some non-Singleton property setters can be defined by the instance
  this.logger.setNamespace('SpringClass');
}
SpringClass.prototype.doLogging = function doLogging() {
  this.logger.log('Logging from a Spring IOC container!');
};

var notQuiteABean = {
  springClass: {
    proto: SpringClass,
    constructorArgs: [{
      ref: 'exampleLogger'
    }]
  },
  exampleLogger: {
    proto: ExampleLogger,
    properties: [{
      name: 'id',
      value: 'springLog'
    }]
  }
};

var springContext = new JsonApplicationContext(notQuiteABean);
springClass = springContext.getBean('springClass');