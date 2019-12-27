import React from 'react';

import RunnableExample from './runnable-example.js';
import scriptText from '!raw-loader!./exampleScripts/setterPrototypeExample.js';

// TODO: Clean scriptText of linting comments

export default () => {
  return (
    <RunnableExample
      title="Setter-Prototype iframe"
      clickFn="setterPrototypeComponent.doLogging()"
      code={scriptText}
      exampleId="setterPrototypeLog"
    ></RunnableExample>
  );
}
