// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.

(window as any).__webpack_public_path__ = document.querySelector('body')!.getAttribute('data-base-url') + 'nbextensions/jupyter_jsmol';

// Configure requirejs
if ((window as any).require) {
    (window as any).require.config({
        map: {
            "*": {
                "jupyter-jsmol": "nbextensions/jupyter_jsmol/index",
            },
        },
    });
}

// Export the required load_ipython_extention
export function load_ipython_extension() {
    // Workaround for importing the JSmol
    const script = document.createElement('script');
    script.src = (window as any).__webpack_public_path__ + '/jsmol/JSmol.min.nojq.js';
    script.async = false;
    (document as any).querySelector('head').appendChild(script);

}

// export * from './index';

