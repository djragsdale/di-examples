// import mdxToJsx from 'gatsby-plugin-mdx/utils/mdx';
// import mdx from '@mdx-js/mdx'
// import { MDXProvider, mdx: createElement } from '@mdx-js/react'
import React, { Fragment } from "react"
// import { Styled } from "theme-ui"

/**
 * Change the content to add your own bio
 */

// const Wrapper = props => <main style={{ padding: '20px', backgroundColor: 'tomato' }} {...props} />

export default ({ children }) => {
  return (<Fragment>
    {children}
  </Fragment>)
}