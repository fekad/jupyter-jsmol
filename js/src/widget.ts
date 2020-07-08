// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

import {
    DOMWidgetModel, DOMWidgetView, ISerializers, WidgetView
} from '@jupyter-widgets/base';

import {
    MODULE_NAME, MODULE_VERSION
} from './version';

// Import the CSS
import '../css/widget.css'

import * as screenfull from 'screenfull';

declare var Jmol: any;
declare var j2sPath: any;

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

export class JsmolModel extends DOMWidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: JsmolModel.model_name,
            _model_module: JsmolModel.model_module,
            _model_module_version: JsmolModel.model_module_version,
            _view_name: JsmolModel.view_name,
            _view_module: JsmolModel.view_module,
            _view_module_version: JsmolModel.view_module_version,
            _info: {},
            _loaded: false
        };
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        // Add any extra serializers here
    };

    static model_name = 'JsmolModel';
    static model_module = MODULE_NAME;
    static model_module_version = MODULE_VERSION;
    static view_name = 'JsmolView';   // Set to null if no view
    static view_module = MODULE_NAME;   // Set to null if no view
    static view_module_version = MODULE_VERSION;
}

/**
 * Renders the widget view.
 *
 * Extra methods provided by the superclass:
 * - send(content: {}, buffers?: ArrayBuffer[] | ArrayBufferView[]): void;
 * - touch(): void; ??
 * - remove(): any; ??
 */
export class JsmolView extends DOMWidgetView {
    private _applet: any;

    /**
     * Initializer, called at the end of the constructor.
     */
    initialize(parameters: WidgetView.InitializeParameters): void {
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
    update(options?: any): void {
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
    render(): any {
        // jsmol_id should be a valid js variable name because it will be used to generate the actual object
        let jsmol_id = "jsmol_" + this.cid;

        // http://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
        let info = {
            width: "100%",
            height: "100%",
            use: "HTML5",
            j2sPath: j2sPath,
            ...this.model.get('_info')
        };

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
    on_custom_message(msg: any): void {
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
    script(command: string): void {
        Jmol.script(this._applet, command);
    }

    /**
     * Evaluate the given commands using JSmol and return the corresponding
     * value. This calls `Jmol.evaluateVar` behind the scenes.
     */
    evaluate(command: string): any {
        return Jmol.evaluateVar(this._applet, command);
    }

    /**
     * Returning with th result of `getPropertyAsArray` for a given expression
     */
    property(command: string): any {
        return Jmol.getPropertyAsArray(this._applet, command);
    }

    /**
     * Show this viewer in fullscreen.
     */
    fullscreen(): void {
        if (screenfull.isEnabled) {
            screenfull.request(this.el);
        }
    }

    /**
     * The main purpose of this callback to remove jsmol applet object from memory when it has been closed.
     * Important: this callback will be only called by the close() or close_all() python functions.
     */
    on_destroy(): void {
        // console.log("DEBUG: on_destroy");
        // console.log(this);

        // Removing jsmol applet
        delete window[this._applet._id];
        delete this._applet;
    }

}
