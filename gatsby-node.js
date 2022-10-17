const path = require("path")

module.exports.onCreateNode = ({ node, actions }) => {
    const { createNodeField } = actions

    if (node.internal.type === "MarkdownRemark") {
        const slug = path.basename(node.fileAbsolutePath, ".md")
        createNodeField({
            node,
            name: "slug",
            value: slug,
        })
    }
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const projectTemplate = path.resolve(`./src/templates/project.js`)
    const response = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

    let projects = response.data.allMarkdownRemark.edges

    projects.forEach(({ node }, index) => {
        createPage({
            component: projectTemplate,
            path: node.fields.slug,
            context: {
                slug: node.fields.slug,
                title: node.frontmatter.title,
                prev: index === 0 ? null : projects[index - 1].node,
                next: index === projects.length - 1 ? null : projects[index + 1].node,
            },
        })
    })
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
    // If production JavaScript and CSS build
    if (stage === "build-javascript") {
        // Turn off source maps
        actions.setWebpackConfig({
            devtool: false,
        })
    }
}
