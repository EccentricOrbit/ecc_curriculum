// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy-watch'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import {cssModules} from 'rollup-plugin-css-modules'
import html from 'rollup-plugin-html';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/tunepad.ts',
    output: [{
        dir: 'build/js',
        format: 'cjs',
        sourcemap: true
    },
    {
        file : 'build/js/tunepad.min.js',
        format : 'cjs',
        name : 'version',
        plugins : [terser ()]
    }],
    plugins: [
        html({include: '**/*.module.html'}),
        cssModules(),
        typescript({ sourceMap: true }),
        copy({
            watch: [ 'src/index.html', 'src/assets' ],
            targets: [
                { src: 'src/index.html', dest: 'build' },
                { src: 'src/assets', dest: 'build' }
            ],
            flatten : false,
            copyOnce : true,
            outputFolder: 'build'
        }),
        serve('build'),
        livereload()
    ]
};
