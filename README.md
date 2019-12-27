# di-examples

## Base examples

All code is lumped together in `/lib`.

## Blog

Blog post is at `/content/posts/testable-vanilla-javascript.mdx`. It uses a custom runnable example component which allows for code samples to be run and output to a log. The ability for the code samples to be sandboxed in iframes with automatic resizing was a technical hurdle I haven't seen anywhere else. If cleaned up this could be a useful Gatsby component for other people.

## Deployment

Deploys to https://practical-easley-59a038.netlify.com/

## Problems I'm resolving

* If defining the example in `.mdx` files, it cannot contain blank lines without confusing the MDX parser.
* If defining the example in JSX at all, the script curly braces get parsed as JSX.
* If defining the example in a JS file, trying to import with raw-loader still errors on linting rules. Linter comments get placed in the code snippets.

For now, create a separate HOC which wraps RunnableExample and imports the script text via raw-loader:

```javascript
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
```
