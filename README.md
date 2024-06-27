# To install 11ty
```sh
npm install --save-dev @11ty/eleventy
npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight 
npm install --save-dev @11ty/eleventy-fetch
npm install --save-dev pagefind

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
