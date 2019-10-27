module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
    `gatsby-plugin-sitemap`,
  ],
  // Customize your site metadata:
  siteMetadata: {
    siteUrl: `https://www.example.com`,
    title: `David Ragsdale dev`,
    author: `David Ragsdale`,
    description: `Dependency Injection and Inversion of Control in client JavaScript`,
    social: [
      {
        name: `Github`,
        url: `https://github.com/djragsdale/di-examples`,
      },
    ],
  },
}
