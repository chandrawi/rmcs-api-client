import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/bundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        // terser(),
        resolve({
            browser: true
        }),
        commonjs()
    ]
};