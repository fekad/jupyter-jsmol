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
        //JsmolView.__super__.render.apply(this, arguments);

        // every view should have its own unique id
        this.el.setAttribute("id", widgets.uuid());

        // Create an Jmol applet
        this.create_app();

        // Observe changes in the value traitlet in Python, and define a custom callback.
        // Python -> JavaScript update
        // equivalent: this.listenTo(this.model, 'change:count', this._count_changed, this);
        this.model.on('change:info', this.create_app, this);
        this.model.on('change:cmd', this.send_cmd, this);


    },

    create_app: function () {
        console.log('Creating new object using the updated infos');
        console.log(this);

        // Note: jmol object needs to be created otherwise
        // the callback function doesn't have access to info dict
        // jsmol_id should be a valid variable name for a js variable
        let jsmol_id = "jsmol_" + this.model.model_id;

        Jmol.setDocument(false);
        this.jsmol = Jmol.getApplet(jsmol_id, this.model.get('info'));
        console.log(this.jsmol);

        // Finally the the content of the div should be generated
        // this.$el.html(Jmol.getAppletHtml(this.jsmol));
        this.el.innerHTML = Jmol.getAppletHtml(this.jsmol);

        // Magic: https://github.com/phetsims/molecule-polarity/issues/6#issuecomment-55830690
        // like a reset
        // this.jsmol._cover(false);
        Jmol.coverApplet(this.jsmol)
    },

    send_cmd: function () {
        console.log('command: ' + this.model.get('cmd'));
        Jmol.script(this.jsmol, this.model.get('cmd'));
    }
});


module.exports = {
    JsmolModel: JsmolModel,
    JsmolView: JsmolView,
};
