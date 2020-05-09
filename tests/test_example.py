#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Adam Fekete.
# Distributed under the terms of the Modified BSD License.

import pytest

from jupyter_jsmol.viewer import JsmolView


def test_example_creation_blank():
    w = JsmolView()
