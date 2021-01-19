#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Adam Fekete.
# Distributed under the terms of the Modified BSD License.
import time
from ipywidgets import DOMWidget, Layout
from traitlets import Unicode, Dict, Bool, default
from ._frontend import module_name, module_version


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

    _info = Dict(help="The info dictionary for initialising the Jsmol applet").tag(sync=True)
    _loaded = Bool().tag(sync=True)

    default_info = {
        'width': '100%',
        'height': '100%',
        'color': 'black',
        'antialiasDisplay': True,
        'disableInitialConsole': True,
        'disableJ2SLoadMonitor': True,
        'debug': False,
    }

    def __init__(self, script=None, info=None, **kwargs):
        super().__init__(**kwargs)
        self.on_msg(self.handle_response)

        info = info or {}
        self._info = {**self.default_info, **info, 'script': script}
        self.response = None

    @default('layout')
    def _default_layout(self):
        return Layout(height='400px', align_self='stretch')

    def script(self, command):
        # Wait for loading the applet at the beginning
        if not self._loaded:
            time.sleep(.1)

        content = {
            'type': 'call',
            'func': 'script',
            'data': command
        }
        self.send(content=content, buffers=None)

    def evaluate(self, expr):
        content = {
            'type': 'call',
            'func': 'evaluate',
            'data': expr
        }
        self.send(content=content, buffers=None)

    def property(self, expr):
        # https://chemapps.stolaf.edu/jmol/docs/#getproperty
        content = {
            'type': 'call',
            'func': 'property',
            'data': expr
        }
        self.send(content=content, buffers=None)

    def fullscreen(self):
        content = {
            'type': 'call',
            'func': 'fullscreen'
        }
        self.send(content=content, buffers=None)

    def handle_response(self, widget, content, buffers):
        """Handle a msg from the front-end.
        Parameters
        ----------
        content: dict
            Content of the msg.
        """
        method = content.get('type', '')

        if method == 'response':
            self.response = content.get('data', '')

    def load(self, filename: str, *args: str, inline: bool = True):
        # Keeping it only for backwards compatibility.
        return self.load_file(filename, *args, inline=inline)

    def load_file(self, filename: str, *args: str, inline: bool = False):

        if inline:
            with open(filename, mode='r') as file:
                data = file.read()
        else:
            data = filename

        script = self._get_load_command(data, *args, inline=inline)
        return self.script(script)

    def load_str(self, data: str, *args: str):
        script = self._get_load_command(data, *args, inline=True)
        return self.script(script)

    @classmethod
    def from_file(cls, filename: str, *args: str, inline: bool = False):

        if inline:
            with open(filename, mode='r') as file:
                data = file.read()
        else:
            data = filename

        script = cls._get_load_command(data, *args, inline=inline)
        return cls(script=script)

    @classmethod
    def from_str(cls, data: str, *args: str):
        script = cls._get_load_command(data, *args, inline=True)
        return cls(script=script)

    @classmethod
    def from_ase(cls, atoms, *args: str):
        """Loading ASE Atoms object by using extXYZ as an intermediate data format."""

        from io import StringIO
        from ase.io.extxyz import write_xyz

        with StringIO() as f:
            write_xyz(f, atoms)
            xyz_str = f.getvalue()

        return cls.from_str(xyz_str, *args)

    @staticmethod
    def _get_load_command(data: str, *args: str, inline: bool = True):

        if inline:
            data = 'inline "' + data.replace('"', "'") + '"'

        extra_args = ' '.join(args)

        return ';'.join((
            'load {} {}'.format(data, extra_args),
            'set frank off',  # remove jsmol logo
            'set zoomlarge false',  # use the smaller of height/width when setting zoom level
            'set waitformoveto off'  # Allow sending script commands while moveto is executing
            # 'set antialiasdisplay',  # use anti-aliasing
            # 'hide off'
        ))
