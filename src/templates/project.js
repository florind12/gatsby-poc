import React from "react"
import { graphql } from "gatsby"

import rehypeReact from "rehype-react"
import "../styles.css"

const renderAst = new rehypeReact({
    createElement: React.createElement,
}).Compiler

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      htmlAst
    }
  }
`

const Project = (props) => {
  return (
    <div className="container">
      {renderAst(props.data.markdownRemark.htmlAst)}
    </div>
  )
}

export default Project
