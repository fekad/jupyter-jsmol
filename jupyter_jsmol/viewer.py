#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Adam Fekete.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, Layout
from traitlets import Unicode, Dict, default
from ._frontend import module_name, module_version

default_info = {
    'width': "100%",
    'height': "100%",
    'color': 'black',
    'use': "HTML5",
    'j2sPath': "/nbextensions/jupyter-jsmol/jsmol/j2s",
    'antialiasDisplay': True,
    'disableInitialConsole': True,
    'disableJ2SLoadMonitor': True,
    'debug': False,
}

script_template = ';'.join([
    'load {}',
    'set antialiasdisplay',  # use anti-aliasing
    'set frank off',  # remove jmol logo
    'set zoomlarge false',  # use the smaller of height/width when setting zoom level
    'set waitformoveto off'  # Allow sending script commands while moveto is executing
    'hide off'
])


class JsmolView(DOMWidget):
    """An JSMOL widget
    """

    _model_name = Unicode('JsmolModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('JsmolView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.

    info = Dict(help="The values for initialising the Jmol applet").tag(sync=True)
    _script = Unicode(help="Evaluate script for Jmol applet").tag(sync=True)
    _command = Unicode(help="Evaluate command with return value(s) for Jmol applet").tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        additional_info = kwargs.pop('info', {})
        self.info = {**default_info, **additional_info}

    @default('layout')
    def _default_layout(self):
        return Layout(height='400px', align_self='stretch')

    def script(self, command):
        # TODO: it should be only one directional (only works when the command changes)
        self._script = command

    def evaluate(self, command):
        # TODO: it should be only one directional (only works when the command changes)
        self._command = command

    @classmethod
    def from_file(cls, filename, inline=False, **kwargs):

        if inline:
            with open(filename) as file:
                data = file.readlines()
        else:
            data = filename

        additional_info = kwargs.pop('info', {})
        info = {
            **additional_info,
            'script': script_template.format(data)
        }

        return cls(info=info, **kwargs)
