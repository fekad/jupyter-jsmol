#!/usr/bin/env python
# coding: utf-8

import os
from setuptools import setup, find_packages
from setupbase import create_cmdclass, install_npm

root = os.path.abspath(os.path.dirname(__file__))

js_path = os.path.join(root, 'js')
nb_path = os.path.join(root, 'jupyter_jsmol', 'nbextension', 'static')
lab_path = os.path.join(root, 'jupyter_jsmol', 'labextension')

package_data_spec = {
    'jupyter_jsmol': [
        'nbextension/static/*.*js*',
        'labextension/*.tgz'
    ]
}

data_files_spec = [
    ('share/jupyter/nbextensions/jupyter_jsmol', nb_path, '*.js*'),
    ('share/jupyter/lab/extensions', lab_path, '*.tgz'),
    ('etc/jupyter/nbconfig/notebook.d', root, 'jupyter_jsmol.json')
]

cmdclass = create_cmdclass('jsdeps',
                           package_data_spec=package_data_spec,
                           data_files_spec=data_files_spec)
cmdclass['jsdeps'] = install_npm(js_path, build_cmd='build:all')

with open("README.md", "r") as fh:
    long_description = fh.read()

setup_args = dict(
    name='jupyter_jsmol',
    description='JSmol viewer widget for Jupyter',
    long_description=long_description,
    long_description_content_type="text/markdown",
    version='0.1.0',
    author='Adam Fekete',
    author_email='adam@fekete.co.uk',
    url='https://github.com/fekad/jupyter-jsmol',
    license='BSD',
    platforms="Linux, Mac OS X, Windows",
    keywords=['Jupyter', 'Widgets', 'IPython'],
    classifiers=[
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Framework :: Jupyter',
    ],
    packages=find_packages(),
    cmdclass=cmdclass,
    include_package_data=True,
    python_requires='>=3.4',
    install_requires=[
        'ipywidgets>=7.0.0',
    ],
    extras_require={
        'test': [
            'pytest>=3.6',
        ],
        'docs': [
            'mkdocs',
            'mkdocs-material'
        ],
    },
)

if __name__ == '__main__':
    setup(**setup_args)
