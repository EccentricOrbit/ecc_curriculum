const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { execSync } = require('child_process')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight, {
        alwaysWrapLineHighlights: true,
    });
    eleventyConfig.addPassthroughCopy({ "assets/js" : "js" });
    eleventyConfig.addPassthroughCopy({ "assets/css" : "css" });
    eleventyConfig.addPassthroughCopy({ "assets/sounds" : "sounds" });
    eleventyConfig.addPassthroughCopy({ "assets/images" : "images" });
    eleventyConfig.addPassthroughCopy({ "assets/webfonts" : "webfonts" });

    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    });

    // limit filter
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });
};

async function wait(delay = 2000) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}