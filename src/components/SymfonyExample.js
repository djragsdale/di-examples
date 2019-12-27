import React from 'react';

import RunnableExample from './runnable-example.js';
import scriptText from '!raw-loader!./exampleScripts/symfonyExample.js';

// TODO: Clean scriptText of linting comments

export default () => {
  return (
    <RunnableExample
      title="Symfony iframe"
      clickFn="symfonyClass.doLogging()"
      code={scriptText}
      exampleId="symfonyLog"
    ></RunnableExample>
  );
}
