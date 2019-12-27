import React from 'react';

import RunnableExample from './runnable-example.js';
import scriptText from '!raw-loader!./exampleScripts/angularJsExample.js';

// TODO: Clean scriptText of linting comments

export default () => {
  return (
    <RunnableExample
      title="AngularJS iframe"
      clickFn="angularJsContext.angularJsFunction()"
      code={scriptText}
      exampleId="angularJsLog"
    ></RunnableExample>
  );
}
