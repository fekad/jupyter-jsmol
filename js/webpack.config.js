const path = require('path');
const version = require('./package.json').version;

// Custom webpack rules
const rules = [
    {test: /\.ts$/, loader: 'ts-loader'},
    {test: /\.js$/, loader: 'source-map-loader'},
    {test: /\.css$/, use: ['style-loader', 'css-loader']}
];

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base', '@jupyterlab/coreutils'];

const resolve = {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".js"]
};

module.exports = [
    /**
     * Notebook extension
     */

    /**
     * Bundle for the notebook containing the custom widget views and models
     * This bundle contains the implementation for the custom widget views and
     * custom widget. It must be an amd module.
     */
    {
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '..', 'jupyter_jsmol', 'nbextension', 'static'),
            libraryTarget: 'amd'
        },
        module: {
            rules: rules
        },
        devtool: 'source-map',
        externals,
        resolve,
    },

    /**
     * This bundle only contains the part of the JavaScript that is run on load of
     * the notebook. This section generally only perform some configuration for
     * requirejs, and provides the legacy "load_ipython_extension" function which
     * is required for any notebook extension.
     */
    {
        entry: './src/extension.ts',
        output: {
            filename: 'extension.js',
            path: path.resolve(__dirname, '..', 'jupyter_jsmol', 'nbextension', 'static'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        resolve,
    },

    /**
     * Embeddable jupyter-jsmol bundle
     *
     * This bundle is almost identical to the notebook extension bundle. The only
     * difference is in the configuration of the webpack public path for the
     * static assets.
     *
     * The target bundle is always `dist/index.js`, which is the path required by
     * the custom widget embedder.
     */
    {
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'amd',
            library: "jupyter-jsmol",
            publicPath: 'https://unpkg.com/jupyter-jsmol@' + version + '/dist/'
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        externals,
        resolve,
    },


    /**
     * Documentation widget bundle
     *
     * This bundle is used to embed widgets in the package documentation.
     */
    {
        entry: './src/index.ts',
        output: {
            filename: 'embed-bundle.js',
            path: path.resolve(__dirname, '..', 'docs', 'static'),
            library: "jupyter-jsmol",
            libraryTarget: 'amd'
        },
        module: {
            rules: rules
        },
        devtool: 'source-map',
        externals,
        resolve,
    }

];
