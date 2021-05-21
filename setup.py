#!/usr/bin/env python
# coding: utf-8

import os
from os.path import join as pjoin
from setuptools import setup, find_packages

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)

HERE = os.path.abspath(os.path.dirname(__file__))

# The name of the project
name = "jupyter_jsmol"

# Get the version
version = get_version(pjoin(name, "_version.py"))

# Representative files that should exist after a successful build
jstargets = [
    pjoin(HERE, name, "nbextension", "index.js"),
    pjoin(HERE, "js", "lib", "plugin.js"),
]

package_data_spec = {name: ["nbextension/**js*", "labextension/**"]}

data_files_spec = [
    ("share/jupyter/nbextensions/jupyter_jsmol", "jupyter_jsmol/nbextension", "**"),
    ("share/jupyter/labextensions/jupyter_jsmol", "jupyter_jsmol/labextension", "**"),
    # ("share/jupyter/labextensions/jupyter_jsmol", ".", "install.json"),
    ("etc/jupyter/nbconfig/notebook.d", ".", "jupyter_jsmol.json"),
]

cmdclass = create_cmdclass(
    "jsdeps", package_data_spec=package_data_spec, data_files_spec=data_files_spec
)
cmdclass["jsdeps"] = combine_commands(
    install_npm(HERE, build_cmd="build:prod"),
    ensure_targets(jstargets),
)

with open("README.md", "r") as fh:
    long_description = fh.read()

setup_args = dict(
    name=name,
    description="JSmol viewer widget for Jupyter",
    long_description=long_description,
    long_description_content_type="text/markdown",
    version=version,
    author="Adam Fekete",
    author_email="adam@fekete.co.uk",
    url="https://github.com/modl-uclouvain/jupyter-jsmol",
    license="BSD",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "Widgets", "IPython"],
    classifiers=[
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Framework :: Jupyter",
    ],
    cmdclass=cmdclass,
    packages=find_packages(),
    include_package_data=True,
    python_requires=">=3.6",
    install_requires=[
        "ipywidgets>=7.0.0",
    ],
    extras_require={
        "test": [
            "pytest>=4.6",
            "pytest-cov",
        ],
        "docs": ["mkdocs", "mkdocs-material"],
        "examples": ["ase", "matplotlib", "plotly"],
    },
)

if __name__ == "__main__":
    setup(**setup_args)
