// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

// TODO:
// - evaluate with return values
// - cleanup
// - documentation
// - this._applet VS this.jsmol
// - static info

import {
    DOMWidgetModel, DOMWidgetView, ISerializers, WidgetView
} from '@jupyter-widgets/base';

import {
    MODULE_NAME, MODULE_VERSION
} from './version';


// Import the CSS
import '../css/widget.css'

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
            // value: 'Hello World'
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

//

/**
 * Renders the widget view.
 *
 * Extra methods provided by the superclass:
 * - send(content: {}, buffers?: ArrayBuffer[] | ArrayBufferView[]): void;
 * - touch(): void; ??
 * - remove(): any; ??
 */
export class JsmolView extends DOMWidgetView {
    private jsmol: any;


    /**
     * Public constructor.
     */
    constructor(options?: any) {
        console.log("DEBUG: constructor");
        console.log(options);
        super(options);
    }

    /**
     * Initializer, called at the end of the constructor.
     */
    initialize(parameters: WidgetView.InitializeParameters): void {
        console.log("DEBUG: initialize");
        console.log(parameters);

        super.initialize(parameters);
    }

    /**
     * Triggered on model change.
     *
     * Update view to be consistent with this.model. The model may have been
     * changed by another view or by a state update from the back-end.
     */
    update(options?: any): void {
        console.log("DEBUG: update");
        console.log(options);

        super.update(options);
    }


    /**
     * Render a view
     *
     * @returns the view or a promise to the view.
     */
    // Defines how the widget gets rendered into the DOM
    render(): any {
        super.render();

        // if (window.Jmol === undefined) {
        //     throw Error('Jmol is required, load it from your favorite source');
        // }


        // every view should have its own unique id
        // this.el.setAttribute("id", uuid());

        // Observe changes in the value traitlet in Python, and define a custom callback.
        // Python -> JavaScript update
        // equivalent: this.listenTo(this.model, 'change:count', this._count_changed, this);
        this.model.on('change:_initialisation', this.create, this);
        this.model.on('change:_script', this.script, this);
        this.model.on('change:_command', this.evaluate, this);
        this.model.on('change:_toggle_fullscreen', this.fullscreen, this);

        this.model.on('msg:custom', this.on_custom_message, this);
        this.model.on('destroy', this.on_destroy, this);

        // Create an Jmol applet
        this.create();

        console.log("DEBUG: render");
        console.log(this);
    }

    /**
     * Using custom massage help to implement simple one-way communication
     */
    on_custom_message(content: any): void {

        console.log("DEBUG: on_custom_message");
        console.log(content);

        if (content.command == "fullscreen") {
            this.fullscreen()
        }
    }


    /**
     * Construct a JsMol applet for this view. Each view should have an unique jsmol applet to work.
     */
    create(): void {
        // jsmol_id should be a valid js variable name because it will be used to generate the actual object
        let jsmol_id = "jsmol_" + this.cid;

        // http://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
        // let info = this.model.get('info');
        let info = {
            width: "100%",
            height: "100%",
            color: 'black',
            use: "HTML5",
            j2sPath: j2sPath,
            antialiasDisplay: true,
            disableInitialConsole: true,
            disableJ2SLoadMonitor: true,
            debug: false,
            ...this.model.get('_initialisation')
        };

        // store a reference to the global Jmol and the HTML root
        // this._Jmol = window.Jmol;

        // Do not insert new applets automatically
        Jmol.setDocument(false);

        this.jsmol = Jmol.getApplet(jsmol_id, info);

        // Finally the the content of the div should be generated
        this.el.innerHTML = Jmol.getAppletHtml(this.jsmol);

        // Jmol rely on this script being implicitly executed, but this is not
        // the case when using innerHTML (compared to jquery .html()). So let's
        // manually execute it
        // Jmol.coverApplet(this.jsmol);
        this.jsmol._cover(false);

        console.log("DEBUG: create");
        console.log(this);
    }

    /**
     * The main purpose of this callback to remove jsmol applet object from memory when it has been closed.
     * Important: this callback will be only called by the close() or close_all() python functions.
     */
    on_destroy(): void {

        // Remove jsmol applet
        delete window[this.jsmol._id];
        delete this.jsmol;

        // Destroying the view itself
        // this.remove();

        console.log("DEBUG: on_destroy");
        console.log(this);
    }

    /**
     * Run the given `command` for this viewer.
     */

    script(): void {
        let command = this.model.get('_script');
        Jmol.script(this.jsmol, command);
    }

    /**
     * Evaluate the given commands using JSmol and return the corresponding
     * value. This calls `Jmol.evaluateVar` behind the scenes.
     */
    evaluate(): any {
        let command = this.model.get('_command');
        console.log('evaluate: ' + command);
        let value = Jmol.evaluateVar(this.jsmol, command);
        console.log('value: ' + value);
        return value;
    }

    /**
     * Show this viewer in fullscreen.
     * TODO: https://github.com/sindresorhus/screenfull.js/
     */
    fullscreen(): void {
        // reset the state of the traitlet
        this.model.set('_toggle_fullscreen', false);
        this.model.save();

        this.el.requestFullscreen();
    }
}
