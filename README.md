# To install 11ty
`npm install @11ty/eleventy --save-dev`  
`npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev`  
`npm install --save-dev pagefind`  

# To run dev server
`npx @11ty/eleventy --serve`

# To generate static site one time
`npx @11ty/eleventy`

# To generate markdown from pydocs
Note this should only be done when changes are made to the TunePad python documentation.

`pipx install pydoc-markdown`

Then run the command:
`./pydocmd.sh`

Reference: https://niklasrosenstein.github.io/pydoc-markdown/
