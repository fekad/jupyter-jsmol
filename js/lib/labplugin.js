var plugin = require('./index');
var base = require('@jupyter-widgets/base');

const coreutils = require("@jupyterlab/coreutils");

const base_url = coreutils.PageConfig.getBaseUrl();
window.j2sPath = base_url + "nbextensions/jupyter-jsmol/jsmol/j2s";

module.exports = {
  id: 'jupyter-jsmol:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'jupyter-jsmol',
          version: plugin.version,
          exports: plugin
      });
      // Workaround for importing the JSmol
      const script = document.createElement('script');
      script.src = base_url + 'nbextensions/jupyter-jsmol/jsmol/JSmol.min.js';
      script.async = false;
      document.querySelector('head').appendChild(script);
  },
  autoStart: true
};

