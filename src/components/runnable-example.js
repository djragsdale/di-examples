import React, { Fragment } from 'react';
import Prism from 'prismjs';
import Frame from 'react-frame-component';
// import { Styled } from 'theme-ui';
import uuid from 'uuid/v4';
import useIframeResizer from './hooks/useIframeResizer';
import useIframeScriptContent from './hooks/useIframeScriptContent';
// import useScriptContent from './hooks/useScriptContent';

/**
 * Change the content to add your own bio
 */

const getGlobalScripts = (iframeId) => `
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

function ExampleLogger(namespace, id) {
  this.lines = [];
  this.threshold = 100;
  if (namespace) {
    this.setNamespace(namespace);
  }
  if (id) {
    this.setId(id);
  }
}
ExampleLogger.prototype = Object.create(Logger.prototype);
ExampleLogger.prototype.constructor = Logger;
ExampleLogger.prototype.setId = function setId(id) {
  this.id = id;
};
ExampleLogger.prototype.setNamespace = function setNamespace(namespace) {
  this.namespace = namespace;
};
ExampleLogger.prototype.log = function log(message) {
  var formattedMessage = message;
  if (this.namespace) {
    formattedMessage = this.namespace + ': ' + message;
  }

  console.log(formattedMessage);

  this.lines.unshift(formattedMessage);

  // Doesn't currently protect against message containing \\n
  if (this.lines.length > this.threshold) {
    this.lines.pop();
  }

  var element = document.querySelector('#' + this.id);
  if (!element) {
    throw new Error('ExampleLogger cannot find element with id "' + this.id + '"');
  }
  element.innerText = this.lines.join('\\n');
};



// Since we're not using spread syntax, we have to do some fancy footwork with partial application
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Apply_for_new
function applyAndNew(constructor, args) {
  function partial() {
    return constructor.apply(this, args);
  }
  if (typeof constructor.prototype === 'object') {
    partial.prototype = Object.create(constructor.prototype);
  }
  return partial;
}

function triggerResize() {
  if (window.parent) {
    window.parent.postMessage('resizeTrigger=${iframeId}', '*');
  }
}

window.onload = function() {
  triggerResize();
};

function delegatedClickHandler(clickFn) {
  const heldFn = clickFn();
  if (typeof heldFn === 'function') {
    heldFn();
  }
  
  triggerResize();
}


// Accepts dependencies object
function createInjector(dependencies) {
  // Dependencies needing dependencies might need to be done out of order

  return function setterPrototypeInjector(instance) {
    var requestedDependencies = instance.getDependencies();
    requestedDependencies.forEach(function (dependencyName) {
      if (!dependencies[dependencyName]) {
        throw new Error('Dependency "' + dependencyName + '" is not a valid dependency.');
      }

      if (!instance['set' + dependencyName]) {
        throw new Error('prototype missing dependency setter "set' + dependencyName + '"');
      }

      // This would allow the method to instantiate the class
      // instance['set' + dependencyName](dependencies[dependencyName]);

      // Ideally the injector should instantiate the class, like this
      instance['set' + dependencyName](new dependencies[dependencyName]());
    });
  }
}

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

function ContainerReference(containerName) {
  this.containerName = containerName;
}

function SymfonyContainer(containerBuilder, className, classProto) {
  this.containerBuilder = containerBuilder;
  this.className = className;
  this.classProto = classProto;
  this.instance = null;
  this.arguments = [];
  this.methodCalls = [];
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
SymfonyContainer.prototype.addMethodCall = function addMethodCall(methodName, parameters) {
  this.methodCalls.push({
    methodName: methodName,
    parameters: parameters
  });
};
SymfonyContainer.prototype.build = function build() {
  if (this.instance) {
    return this;
  }

  var appliedClass = applyAndNew(this.classProto, this.arguments);
  this.instance = new appliedClass;
  // in ES6
  // this.instance = new this.classProto(...this.arguments);
  var self = this;

  this.methodCalls.forEach(function (methodCall) {
    self.instance[methodCall.methodName].apply(methodCall.parameters);
  });
};

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
`;

export default ({
  clickFn = `function () { console.log('Please pass clickFn to RunnableExample') }`,
  code = '',
  exampleId = 'myExample',
}) => {
  const iframeId = uuid();

  useIframeScriptContent(getGlobalScripts(iframeId).trim(), iframeId);
  useIframeScriptContent(code.trim(), iframeId);

  useIframeResizer(iframeId);

  const wrapperStyles = {
    color: 'white',
    width: '100%',
    // overflow: 'auto',
  };

  const iframeStyles = {
    borderColor: 'none',
    display: 'block',
    width: '100%',
    border: 'none',
  };

  const insideIframeStyles = `
    body {
      margin: 0;
    }

    pre {
      overflow-x: auto;
      background-color: #011627;
      border-radius: 10px;
    }

    pre.example {
      max-height: 250px;
      padding: 28px;
      font-size: 85%;
    }

    pre.log {
      margin-bottom: 14px;
      padding: 32px;
      line-height: 1.75;
    }

    .example-button {
      margin-bottom: 14px;
      padding: 8px;
      background: black;
      color: white;
      min-width: 100px;
      font-size: 85%;
      border-radius: 10px;
      cursor: pointer;
    }
  `;

  const iframeHead = (<Fragment>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.0/themes/prism-tomorrow.min.css"
    />
    <style jsx="true">{insideIframeStyles}</style>
  </Fragment>);

  // const formattedCodeMarkup = code
    // .split()
  const formattedCodeMarkup = Prism.highlight(code, Prism.languages.javascript, 'javascript');

  const wrapClickFn = (fnString) => `delegatedClickHandler(function () { return ${fnString} })`

  return (<Fragment>
    <div>
      <Frame id={iframeId} head={iframeHead} style={iframeStyles} allowFullScreen={false}><div style={wrapperStyles} dangerouslySetInnerHTML={{ __html: `
        <pre class="example"><code class="language-javascript">${formattedCodeMarkup}</code></pre>
        <button class="example-button" onclick="${wrapClickFn(clickFn)}">Run</button>
        <pre id="${exampleId}" class="log prism-code css-w0h414">&nbsp;</pre>
      ` }}></div></Frame>
    </div>
  </Fragment>);
};
