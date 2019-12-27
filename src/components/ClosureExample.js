import React from 'react';

import RunnableExample from './runnable-example.js';
import scriptText from '!raw-loader!./exampleScripts/closureExample.js';

// TODO: Clean scriptText of linting comments

export default () => {
  return (
    <RunnableExample
      title="Closure iframe"
      clickFn="doClosureStuff()"
      code={scriptText}
      exampleId="closureLog"
    ></RunnableExample>
  );
}
