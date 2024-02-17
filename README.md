# To generate static site
> npx @11ty/eleventy

# To run dev server
> npx @11ty/eleventy --serve

# To install 11ty
npm install @11ty/eleventy --save-dev
npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev
npm install --save-dev pagefind

# To generate markdown from pydocs
pipx install pydoc-markdown

Then run the command:
> ./pydocmd.sh

Reference: https://niklasrosenstein.github.io/pydoc-markdown/


# Notes
* Splash images have to be 1200 x 630 or larger with a 1.91:1 ratio

# Todo
* Collection / curriculum pages
* Page aliases
* Cannot GET /activities/play-chord
* Scrollbar in search results
* Pulldown in composer is invisible on chromebooks; one of the drums isn't working

* Spanish translations?
* Pagefind index title, subtitle, description of page

# References
https://rknight.me/using-pagefind-with-eleventy-for-search/