var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

// See viewer.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var JsmolModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name: 'JsmolModel',
        _view_name: 'JsmolView',
        _model_module: 'jupyter-jsmol',
        _view_module: 'jupyter-jsmol',
        _model_module_version: '0.1.0',
        _view_module_version: '0.1.0',
    })
});


// Custom View. Renders the widget model.
var JsmolView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function () {

        // every view should have its own unique id
        this.el.setAttribute("id", widgets.uuid());

        // Create an Jmol applet
        this.create_app();

        // Observe changes in the value traitlet in Python, and define a custom callback.
        // Python -> JavaScript update
        // equivalent: this.listenTo(this.model, 'change:count', this._count_changed, this);
        this.model.on('change:info', this.create_app, this);
        this.model.on('change:_script', this.script, this);
        this.model.on('change:_command', this.evaluate, this);

    },

    create_app: function () {
        console.log('Creating new object using the updated infos');
        console.log(this);

        // jsmol_id should be a valid js variable name because it will be used to generate the actual object
        let jsmol_id = "jsmol_" + this.model.model_id;
        let info = this.model.get('info');

        Jmol.setDocument(false);
        this.jsmol = Jmol.getApplet(jsmol_id, info);
        console.log(this.jsmol);

        // Finally the the content of the div should be generated
        this.el.innerHTML = Jmol.getAppletHtml(this.jsmol);

        // Magic: https://github.com/phetsims/molecule-polarity/issues/6#issuecomment-55830690
        Jmol.coverApplet(this.jsmol)
    },

    script: function () {
        let command = this.model.get('_script');
        console.log('script: ' + command);
        Jmol.script(this.jsmol, command);
    },

    evaluate: function () {
        let command = this.model.get('_command');
        console.log('evaluate: ' + command);
        let value = Jmol.evaluateVar(this.jsmol, command);
        console.log('value: ' + value);
    }
});


module.exports = {
    JsmolModel: JsmolModel,
    JsmolView: JsmolView,
};
