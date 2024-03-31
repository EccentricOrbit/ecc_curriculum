// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy-watch'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import {cssModules} from 'rollup-plugin-css-modules'
import html from 'rollup-plugin-html';

export default {
    input: 'src/main.ts',
    output: {
        dir: 'build/js',
        format: 'cjs'
    },
    plugins: [
        html({include: '**/*.module.html'}),
        cssModules(),
        typescript(),
        copy({
            watch: [ 'src/index.html', 'src/assets' ],
            targets: [
                { src: 'src/index.html', dest: 'build' },
                { src: 'src/assets/css/**/*', dest: 'build/css' }
            ],
            outputFolder: 'build'
        }),
        serve('build'),
        livereload()
    ]
};
