// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Entry point for the notebook bundle containing custom model definitions.
//
// Setup notebook base URL
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
(window as any).__webpack_public_path__ = document.querySelector('body')!.getAttribute('data-base-url') + 'nbextensions/jupyter_jsmol';

export * from './index';

// NEW but static:
// // Entry point for the notebook bundle containing custom model definitions.
// //
//
// define(function() {
//     "use strict";
//
//     window['requirejs'].config({
//         map: {
//             '*': {
//                 'jupyter-jsmol': 'nbextensions/jupyter_jsmol/index',
//             },
//         }
//     });
//     // Export the required load_ipython_extension function
//     return {
//         load_ipython_extension : function() {
//
//             // Workaround for importing the JSmol
//             const script = document.createElement('script');
//             // script.src = '/nbextensions/jupyter_jsmol/jsmol/JSmol.min.nojq.js';
//             script.src = 'https://chemapps.stolaf.edu/jmol/jsmol/JSmol.min.nojq.js';
//             script.async = false;
//             document.querySelector('head').appendChild(script);
//
//         }
//     };
// });


// OLD:
// // This file contains the javascript that is run when the notebook is loaded.
// // It contains some requirejs configuration and the `load_ipython_extension`
// // which is required for any notebook extension.
// //
// // Some static assets may be required by the custom widget javascript. The base
// // url for the notebook is not known at build time and is therefore computed
// // dynamically.
// __webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/{{ cookiecutter.npm_package_name }}';
//
//
// // Configure requirejs
// if (window.require) {
//     window.require.config({
//         map: {
//             "*" : {
//                 "jupyter-jsmol": "nbextensions/jupyter-jsmol/index",
//             }
//         }
//     });
// }
//
// // Export the required load_ipython_extension
// module.exports = {
//     load_ipython_extension: function() {}
// };