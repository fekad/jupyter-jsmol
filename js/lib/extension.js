// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.

__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/jupyter-jsmol';

window.j2sPath = __webpack_public_path__ + "/jsmol/j2s";

// Configure requirejs
if (window.require) {
    window.require.config({
        map: {
            "*" : {
                "jupyter-jsmol": "nbextensions/jupyter-jsmol/index",
            }
        }
    });
}

// Export the required load_ipython_extension
module.exports = {
    load_ipython_extension: function() {
        // Workaround for importing the JSmol
        const script = document.createElement('script');
        script.src = __webpack_public_path__ + '/jsmol/JSmol.min.nojq.modified.js';
        script.async = false;
        document.querySelector('head').appendChild(script);
    }
};
