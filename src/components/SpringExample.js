import React from 'react';

import RunnableExample from './runnable-example.js';
import scriptText from '!raw-loader!./exampleScripts/springExample.js';

// TODO: Clean scriptText of linting comments

export default () => {
  return (
    <RunnableExample
      title="Spring iframe"
      clickFn="springClass.doLogging()"
      code={scriptText}
      exampleId="springLog"
    ></RunnableExample>
  );
}
