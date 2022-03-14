module.exports = config => {
  config.addPassthroughCopy("src/CNAME")
  config.addPassthroughCopy("src/manifest.json")
  config.addPassthroughCopy("src/fonts")
  config.addPassthroughCopy("src/images")
  config.addPassthroughCopy("src/scripts")
  config.addPassthroughCopy("src/styles")

  config.addShortcode("year", () => `${new Date().getFullYear()}`)

  config.addFilter("fixLinks", content => {
    const reg = /(src="[^(https:\/\/)])|(src="\/)|(href="[^(https:\/\/)])|(href="\/)/g
    const prefix = `https://dair.lv${content.url}`
    return content.templateContent.replace(reg, (match) => {
      if (match === `src="/` || match === `href="/`) {
        match = match.slice(0, -1)
        return match + prefix
      } else {
        return match.slice(0, -1) + prefix + match.slice(-1)
      }
    })
  })

  config.addFilter("addLoadingLazy", content => {
    content.replace(/<img(?!.*loading)/g, "<img loading=\"lazy\"")
  })

  config.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      const minify = require("html-minifier").minify

      return minify(content, {
        removeComments: true,
        collapseWhitespace: true
      })
    }

    return content
  })

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    dataTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    templateFormats: ["liquid"],
    markdownTemplateEngine: false,
    passthroughFileCopy: true
  }
}
