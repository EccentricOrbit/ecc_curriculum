const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { execSync } = require('child_process');
const HTMLtoDOCX =  require('html-to-docx')


module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(syntaxHighlight, {
        alwaysWrapLineHighlights: true,
    });

    eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

    eleventyConfig.addPassthroughCopy({ "assets/js" : "js" });
    eleventyConfig.addPassthroughCopy({ "assets/css" : "css" });
    eleventyConfig.addPassthroughCopy({ "assets/sounds" : "sounds" });
    eleventyConfig.addPassthroughCopy({ "assets/images" : "images" });
    eleventyConfig.addPassthroughCopy({ "assets/python" : "python" });
    eleventyConfig.addPassthroughCopy({ "assets/webfonts" : "webfonts" });

    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    });

    // limit filter
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });  
    eleventyConfig.addAsyncShortcode("downloadButton", async function(content) {
      try {
        // Replace <code> tags with a custom element that we can style
        const processedContent = content.replace(/<code/g, '<p class="code"').replace(/<\/code>/g, '</p>');
        
        const docxBuffer = await HTMLtoDOCX(processedContent, "This can be the header", {}, "Tunepad Tutorial");
        const encodedContent = docxBuffer.toString('base64');
    
        return `<button onclick="downloadDocx('${encodedContent}', '${this.page.fileSlug}.docx')">Download Tutorial</button>`;
      } catch (error) {
        console.error('Error converting HTML to DOCX:', error);
        return '<button disabled>Download Unavailable</button>';
      }
    });
  
    eleventyConfig.addTransform("captureContent", function(content, outputPath) {
      if(outputPath && outputPath.endsWith(".html")) {
        let parsed = content.match(/<main[^>]*>([\s\S]*)<\/main>/i);
        if(parsed) {
          this.page.content = parsed[1];
        }
      }
      return content;
    });
  
    eleventyConfig.addPassthroughCopy({ "assets/js/download.js": "js/download.js" });
};
