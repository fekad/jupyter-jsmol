from __future__ import print_function
from setuptools import setup, find_packages

import os
from os.path import join as pjoin
from distutils import log

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)


here = os.path.dirname(os.path.abspath(__file__))

log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

name = 'jupyter_jsmol'

with open("README.md", "r") as fh:
    long_description = fh.read()


# Get jupyter_jsmol version
version = get_version(pjoin(name, '_version.py'))

js_dir = pjoin(here, 'js')

# Representative files that should exist after a successful build
jstargets = [
    pjoin(js_dir, 'dist', 'index.js'),
]

data_files_spec = [
    ('share/jupyter/nbextensions/jupyter-jsmol', 'jupyter_jsmol/nbextension', '**'),
    ('share/jupyter/labextensions/jupyter-jsmol', 'jupyter_jsmol/labextension', '**'),
    ('share/jupyter/labextensions/jupyter-jsmol', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'jupyter-jsmol.json'),
]

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(
    install_npm(js_dir, npm=['yarn'], build_cmd='build:prod'), ensure_targets(jstargets),
)

setup_args = dict(
    name=name,
    version=version,
    description='JSmol viewer widget for Jupyter',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='Adam Fekete',
    author_email='adam.fekete@unamur.be',
    url='https://github.com/fekad/jupyter-jsmol',
    keywords=[
        'ipython',
        'jupyter',
        'widgets',
    ],
    classifiers=[
        'Framework :: Jupyter',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Physics',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
    python_requires=">=3.6",
    install_requires=[
        'ipywidgets>=7.6.0',
    ],
    extras_require={
        "test": [
            "pytest>=4.6",
            "pytest-cov",
        ],
        "examples": ["ase", "pymatgen"],
    },
    packages=find_packages(),
    cmdclass=cmdclass,
    include_package_data=True,
    zip_safe=False,
)

setup(**setup_args)
