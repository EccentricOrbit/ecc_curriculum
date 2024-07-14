// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import {cssModules} from 'rollup-plugin-css-modules'
import html from 'rollup-plugin-html'
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser'

export default {
    input: 'src/index.ts',
    output: [
        {
            file : 'assets/js/example.min.js',
            format : 'iife',
            name : 'example',
            sourcemap : true,
            plugins : [ terser() ]
        }
    ],
    plugins: [
        html({include: ['**/*.module.html', '**/*.svg' ]}),
        cssModules(),
        serve('.'),
        typescript({ sourceMap: true })
    ],
};