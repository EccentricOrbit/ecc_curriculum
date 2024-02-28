# To generate static site
> npx @11ty/eleventy

# To run dev server
> npx @11ty/eleventy --serve

# To install 11ty
> npm install @11ty/eleventy --save-dev
> npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev
> npm install --save-dev pagefind

# To generate markdown from pydocs
Note this should only be done when changes are made to the TunePad python documentation.

> pipx install pydoc-markdown

Then run the command:
> ./pydocmd.sh

Reference: https://niklasrosenstein.github.io/pydoc-markdown/


# Notes
Splash images must be 600 x 400 or larger with a 1.5 ratio.

# Todo
* Add Roses tutorial
* Include the variables and loops sheets from Still DRE somewhere
* TunePad loops library
* Curriculum pages
* Pulldown in composer is invisible on chromebooks; one of the drums isn't working
* Tutorial videos
* More extensive mobile testing. Search is non-functional for phones
* Spanish translations?


# References
https://rknight.me/using-pagefind-with-eleventy-for-search/
