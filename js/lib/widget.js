var widgets = require('@jupyter-widgets/base');
var screenfull = require('screenfull');
var _ = require('lodash');

// const version = require("./version");

// See example.py for the kernel counterpart to this file.


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

// var JsmolModel = widgets.DOMWidgetModel.extend({
//     defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
//         _model_name : 'JsmolModel',
//         _view_name : 'JsmolView',
//         _model_module : 'jupyter-jsmol',
//         _view_module : 'jupyter-jsmol',
//         _model_module_version : '2022.1.0',
//         _view_module_version : '2022.1.0',
//         _info: {},
//         _loaded: false
//     })
// });

// Custom View. Renders the widget model.
// var JsmolView = widgets.DOMWidgetView.extend({
//     // Defines how the widget gets rendered into the DOM
//     render: function() {
//         this.value_changed();
//
//         // Observe changes in the value traitlet in Python, and define
//         // a custom callback.
//         this.model.on('change:value', this.value_changed, this);
//     },
//
//     value_changed: function() {
//         this.el.textContent = this.model.get('value');
//     }
// });


class JsmolModel extends widgets.DOMWidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name : 'JsmolModel',
            _view_name : 'JsmolView',
            _model_module : 'jupyter-jsmol',
            _view_module : 'jupyter-jsmol',
            _model_module_version : '2022.1.0',
            _view_module_version : '2022.1.0',
            _info: {},
            _loaded: false
        };
    }
}



/**
 * Renders the widget view.
 *
 * Extra methods provided by the superclass:
 * - send(content: {}, buffers?: ArrayBuffer[] | ArrayBufferView[]): void;
 * - touch(): void; ??
 * - remove(): any; ??
 */
class JsmolView extends widgets.DOMWidgetView {
    /**
     * Initializer, called at the end of the constructor.
     */
    initialize(parameters) {
        super.initialize(parameters);
        // Observe changes in the value traitlet in Python, and define a custom callback.
        // this.model.on('change:_info', this.update, this);
        this.model.on('msg:custom', this.on_custom_message, this);
        this.model.on('destroy', this.on_destroy, this);
    }

    /**
     * Triggered on model change.
     *
     * Update view to be consistent with this.model. The model may have been
     * changed by another view or by a state update from the back-end.
     */
    update(options) {
        // console.log("DEBUG: update");
        // console.log(options);
        super.update(options);
    }

    /**
     * Render a view
     *
     * Construct a Jsmol applet for this view. Each view should have an unique jsmol applet to work.
     * @returns the view or a promise to the view.
     */
    // Defines how the widget gets rendered into the DOM
    render() {
        // jsmol_id should be a valid js variable name because it will be used to generate the actual object
        let jsmol_id = "jsmol_" + this.cid;

        // http://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
        let info = Object.assign({ width: "100%", height: "100%", use: "HTML5", j2sPath: j2sPath }, this.model.get('_info'));

        // Do not insert new applets automatically
        Jmol.setDocument(false);

        // Create the main Jsmol applet
        this._applet = Jmol.getApplet(jsmol_id, info);

        // Finally the the content of the div should be generated
        this.el.innerHTML = Jmol.getAppletHtml(this._applet);

        // Jmol rely on this script being implicitly executed, but this is not
        // the case when using innerHTML (compared to jquery .html()). So let's
        // manually execute it
        Jmol.coverApplet(this._applet);
        this.model.set('_loaded', true);
        this.touch();
    }
    /**
     * Using custom massage help to implement simple one-way communication
     */
    on_custom_message(msg) {
        // console.log("DEBUG: on_custom_message");
        // console.log(msg);
        if (msg.type == 'call') {
            switch (msg.func) {
                case "fullscreen":
                    this.fullscreen();
                    break;
                case 'script':
                    this.script(msg.data);
                    break;
                case 'evaluate':
                    this.send({
                        'type': 'response',
                        'func': 'evaluate',
                        'data': this.evaluate(msg.data)
                    });
                    break;
                case 'property':
                    this.send({
                        'type': 'response',
                        'func': 'property',
                        'data': this.property(msg.data)
                    });
                    break;
                default:
                    console.log('there is no method for ' + msg.func);
                    break;
            }
        }
    }
    /**
     * Run the given `command` for this viewer.
     */
    script(command) {
        Jmol.script(this._applet, command);
    }
    /**
     * Evaluate the given commands using JSmol and return the corresponding
     * value. This calls `Jmol.evaluateVar` behind the scenes.
     */
    evaluate(command) {
        return Jmol.evaluateVar(this._applet, command);
    }
    /**
     * Returning with th result of `getPropertyAsArray` for a given expression
     */
    property(command) {
        return Jmol.getPropertyAsArray(this._applet, command);
    }
    /**
     * Show this viewer in fullscreen.
     */
    fullscreen() {
        if (screenfull.isEnabled) {
            screenfull.request(this.el);
        }
    }
    /**
     * The main purpose of this callback to remove jsmol applet object from memory when it has been closed.
     * Important: this callback will be only called by the close() or close_all() python functions.
     */
    on_destroy() {
        // console.log("DEBUG: on_destroy");
        // console.log(this);
        // Removing jsmol applet
        delete window[this._applet._id];
        delete this._applet;
    }
}


module.exports = {
    JsmolModel: JsmolModel,
    JsmolView: JsmolView
};


