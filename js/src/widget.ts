// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

import {
    DOMWidgetModel, DOMWidgetView, ISerializers, uuid
} from '@jupyter-widgets/base';

import {
    MODULE_NAME, MODULE_VERSION
} from './version';

import {
    PageConfig
} from '@jupyterlab/coreutils';


// Import the CSS
import '../css/widget.css'

declare var Jmol: any;

// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.

// const base_url = document.querySelector('body')!.getAttribute('data-base-url') + 'nbextensions/jupyter_jsmol';
const base_url = PageConfig.getBaseUrl();


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

// Custom View. Renders the widget model.

export class JsmolView extends DOMWidgetView {
    private jsmol: any;

    // Defines how the widget gets rendered into the DOM
    render() {

        // every view should have its own unique id
        this.el.setAttribute("id", uuid());

        // Create an Jmol applet
        this.create_app();

        // Observe changes in the value traitlet in Python, and define a custom callback.
        // Python -> JavaScript update
        // equivalent: this.listenTo(this.model, 'change:count', this._count_changed, this);
        this.model.on('change:_initialisation', this.create_app, this);
        this.model.on('change:_script', this.script, this);
        this.model.on('change:_command', this.evaluate, this);

    }


    create_app() {
        // jsmol_id should be a valid js variable name because it will be used to generate the actual object
        let jsmol_id = "jsmol_" + this.model.model_id;

        // http://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
        // let info = this.model.get('info');
        let info = {
            width: "100%",
            height: "100%",
            color: 'black',
            use: "HTML5",
            j2sPath: base_url + "nbextensions/jupyter_jsmol/jsmol/j2s",
            antialiasDisplay: true,
            disableInitialConsole: true,
            disableJ2SLoadMonitor: true,
            debug: false,
            ...this.model.get('_initialisation')
        };


        Jmol.setDocument(false);
        this.jsmol = Jmol.getApplet(jsmol_id, info);
        console.log(this.jsmol);

        // Finally the the content of the div should be generated
        this.el.innerHTML = Jmol.getAppletHtml(this.jsmol);

        // Jmol rely on this script being implicitly executed, but this is not
        // the case when using innerHTML (compared to jquery .html()). So let's
        // manually execute it
        Jmol.coverApplet(this.jsmol);
    }


    script() {
        let command = this.model.get('_script');
        Jmol.script(this.jsmol, command);
    }


    evaluate() {
        let command = this.model.get('_command');
        console.log('evaluate: ' + command);
        let value = Jmol.evaluateVar(this.jsmol, command);
        console.log('value: ' + value);
    }

}
