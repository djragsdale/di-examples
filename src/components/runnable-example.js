import React, { Fragment } from 'react';
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
`;

export default ({
  clickFn = `function () { console.log('Please pass clickFn to RunnableExample') }`,
  code = '',
  exampleId = 'myExample',
}) => {
  const key = uuid();

  // useScriptContent(getGlobalScripts(key).trim());
  // useScriptContent(code.trim());

  useIframeScriptContent(getGlobalScripts(key).trim(), key);
  useIframeScriptContent(code.trim(), key);

  useIframeResizer(key);

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
      margin-bottom: 14px;
      padding: 32px;
      border-radius: 10px;
      background-color: #011627;
      overflow-x: auto;
      line-height: 1.75;
    }

    pre.language-javascript {
      max-height: 250px;
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

  const iframeHead = (<style jsx="true">{insideIframeStyles}</style>);

  const wrapClickFn = (fnString) => `delegatedClickHandler(function () { return ${fnString} })`

  return (<Fragment>
    <div>
      <Frame id={key} head={iframeHead} style={iframeStyles} allowFullScreen={false}><div style={wrapperStyles} dangerouslySetInnerHTML={{ __html: `
        <pre class="language-javascript prism-code language-javascript css-w0h414"><code>${code}</code></pre>
        <button class="example-button" onclick="${wrapClickFn(clickFn)}">Run</button>
        <pre id="${exampleId}" class="log prism-code css-w0h414">&nbsp;</pre>
      ` }}></div></Frame>
    </div>
  </Fragment>);
};
