// Copyright (c) Adam Fekete
// Distributed under the terms of the Modified BSD License.

// See viewer.py for the kernel counterpart to this file.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers, uuid
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

// Import the CSS
import '../css/widget.css'

declare var Jmol: any;


export
class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      _view_module_version: ExampleModel.view_module_version,
      value : 'Hello World'
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  static view_module_version = MODULE_VERSION;
}


export
class ExampleView extends DOMWidgetView {
  render() {
    this.el.classList.add('custom-widget');

    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }
}

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

export
class JsmolModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: JsmolModel.model_name,
      _model_module: JsmolModel.model_module,
      _model_module_version: JsmolModel.model_module_version,
      _view_name: JsmolModel.view_name,
      _view_module: JsmolModel.view_module,
      _view_module_version: JsmolModel.view_module_version,
      value : 'Hello World'
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'JsmolModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'JsmolView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

// Custom View. Renders the widget model.

export
class JsmolView extends DOMWidgetView {
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
    this.model.on('change:info', this.create_app, this);
    this.model.on('change:_script', this.script, this);
    this.model.on('change:_command', this.evaluate, this);

  }


  create_app() {
    // jsmol_id should be a valid js variable name because it will be used to generate the actual object
    let jsmol_id = "jsmol_" + this.model.model_id;
    let info = this.model.get('info');

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
