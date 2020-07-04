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

    _initialisation = Dict(help="The values for initialising the Jmol applet").tag(sync=True)
    _script = Unicode(help="Evaluate script for Jmol applet").tag(sync=True)
    _command = Unicode(help="Evaluate command with return value(s) for Jmol applet").tag(sync=True)

    def __init__(self, script=None, **kwargs):
        super().__init__(**kwargs)

        self._initialisation = {'script': script}

    @default('layout')
    def _default_layout(self):
        return Layout(height='400px', align_self='stretch')

    def script(self, command):
        # TODO: it should be only one directional (only works when the command changes)
        self._script = command

    def evaluate(self, command):
        # TODO: it should be only one directional (only works when the command changes)
        self._command = command

    def load(self, filename, inline=False):
        if inline:
            with open(filename, mode='r') as file:
                data = file.read()

            data = data.replace('"', "'")
            return self.script(f'load inline "{data}"')

        return self.script(f'load {filename}')

    @classmethod
    def from_file(cls, filename, inline=False):
        if inline:
            with open(filename, mode='r') as file:
                data = file.read()

            data = data.replace('"', "'")
            return cls(script=script_template.format(f'inline "{data}"'))

        return cls(script=script_template.format(filename))

    @classmethod
    def from_ase(cls, atoms):
        """Loading ASE Atoms object by using extXYZ as an intermediate data format."""

        import ase.io
        from io import StringIO

        with StringIO() as f:
            ase.io.extxyz.write_xyz(f, atoms)
            xyz_str = f.getvalue()

        data = xyz_str.replace('"', "'")
        return cls(script=script_template.format(f'inline "{data}"'))
