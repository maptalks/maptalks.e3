const pkg = require('./package.json');
const { babel } = require('@rollup/plugin-babel');

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n * (c) 2016-${new Date().getFullYear()} maptalks.com\n */`;

const plugins = [babel({ babelHelpers: 'bundled' })];
const external = ['maptalks', 'echarts'];
const globals = {
    'maptalks': 'maptalks',
    'echarts': 'echarts'
};
module.exports = [
    {
        input: 'index.js',
        plugins,
        external,

        output: [
            {
                'sourcemap': false,
                'format': 'es',
                'banner': banner,
                globals,
                'file': pkg.module
            },
            {
                'sourcemap': false,
                'format': 'umd',
                'banner': banner,
                'extend': true,
                'name': 'maptalks',
                globals,
                'file': pkg.main
            },
            {
                'sourcemap': false,
                'format': 'umd',
                'banner': banner,
                'extend': true,
                'name': 'maptalks',
                globals,
                'file': 'dist/maptalks.e3.min.js'
            }
        ]
    }
];
