// Entry point for the notebook bundle containing custom model definitions.
//
define(function() {
    "use strict";

    window['requirejs'].config({
        map: {
            '*': {
                'jupyter-jsmol': 'nbextensions/jupyter_jsmol/index',
            },
        }
    });
    // Export the required load_ipython_extension function
    return {
        load_ipython_extension : function() {

            // Workaround for importing the JSmol
            const script = document.createElement('script');
            // script.src = '/nbextensions/jupyter_jsmol/jsmol/JSmol.min.nojq.js';
            script.src = 'https://chemapps.stolaf.edu/jmol/jsmol/JSmol.min.nojq.js';
            script.async = false;
            document.querySelector('head').appendChild(script);

        }
    };
});
