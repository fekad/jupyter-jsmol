// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

// Entry point for the notebook bundle containing custom model definitions.
//
// Setup notebook base URL
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// (window as any).__webpack_public_path__ =
//   document.querySelector('body')!.getAttribute('data-base-url') +
//   'nbextensions/{{ cookiecutter.python_package_name }}';

const base_url = document.querySelector('body')!.getAttribute('data-base-url');
(window as any).__webpack_public_path__ = base_url + 'nbextensions/jupyter_jsmol';
(window as any).j2sPath = base_url + "nbextensions/jupyter_jsmol/jsmol/j2s";

// Export the required load_ipython_extention
export function load_ipython_extension() {
    // Workaround for importing the JSmol
    const script = document.createElement('script');
    script.src = base_url + 'nbextensions/jupyter_jsmol/jsmol/JSmol.min.nojq.js';
    script.async = false;
    (document as any).querySelector('head').appendChild(script);
}

export * from './index';