# Setup Following
https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js

Toolchain consists of node, typescript, rollup. 
Philosophy is to keep things as minimal as possible.
Goal is for this to work with Eleventy dev stack.


# Install

Basic dependencies are Rollup and Typescript. 
We also need a rollup plugin to integrate with typescript
```sh
npm install --save-dev rollup typescript rimraf
npm install --save-dev @rollup/plugin-typescript
npm install --save-dev rollup-plugin-copy-watch
npm install --save-dev rollup-plugin-serve
npm install --save-dev rollup-plugin-livereload
npm install --save-dev rollup-plugin-css-modules
npm install --save-dev rollup-plugin-html
npm install --save-dev @rollup/plugin-terser
```

# Scripts
* `npm run build`
* `npm run watch`


# Compile TypeScript
`npx tsc`

# Watch
`tsc -w`


