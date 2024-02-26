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
* NY Times uses 600 x 400. Seems much more reasonable. 1.5 ratio
* Splash images have to be 600 x 400 or larger with a 1.5 ratio

# Todo
* Add Roses tutorial
* Home link in top menu
* Separate tutorial categories (e.g. Activities, Tutorials)
* Badges for card layout
* Test responsive and print layouts
* Puzzlers
* Three tutorials
* Include the variables and loops sheets from Still DRE somewhere
* Landing Page
* TunePad library
* New layout fix
* More... option in top menu
* Collection / curriculum pages
* Page aliases
* Cannot GET /activities/play-chord
* Scrollbar in search results
* Pulldown in composer is invisible on chromebooks; one of the drums isn't working
* Tutorial videos

* Spanish translations?
* Pagefind index title, subtitle, description of page

# References
https://rknight.me/using-pagefind-with-eleventy-for-search/