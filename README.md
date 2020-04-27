
# jupyter-jsmol
[![Python package](https://github.com/fekad/jupyter-jsmol/workflows/Python%20package/badge.svg)](https://github.com/fekad/jupyter-jsmol/actions)
[![Docs](https://github.com/fekad/jupyter-jsmol/workflows/Python%20documetation/badge.svg)](https://fekad.github.io/jupyter-jsmol/)


Jupyter notebook package for Jmol

## Installation

You can install using `pip`:

```bash
pip install jupyter_jsmol
```

Or if you use jupyterlab:

```bash
pip install jupyter_jsmol
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] jupyter_jsmol
```

## Development

For a development installation (requires npm),

    $ git clone https://github.com/fekad/jupyter-jsmol.git
    $ cd jupyter-jsmol
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix jupyter_jsmol
    $ jupyter nbextension enable --py --sys-prefix jupyter_jsmol
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This take a minute or so to get started, but then allows you to hot-reload your javascript extension.
To see a change, save your javascript, watch the terminal for an update.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.




## QUICK TODO LIST

- using github actions instead of travis
- send or massaging instead of state synchronisation
- adding evaluate return value
- prevent to create jsmol_... object when the getApplet function has been called
- info should be moved to js only
- the file that you want to load has to be in the same folder as the notebook
- Jupyterlab issue: Plugin 'jupyter-jsmol' failed to activate.



## More

- https://ipywidgets.readthedocs.io/en/stable/examples/Widget%20Custom.html
- https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Low%20Level.html
- http://kazuar.github.io/jupyter-widget-tutorial/
- https://github.com/jupyter-widgets/widget-cookiecutter
- http://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Functions
- https://github.com/cosmo-epfl/chemiscope
- https://www.npmjs.com/package/jsmol-widget





## Old installation instructions


To install for jupyterlab

    $ jupyter labextension install jupyter_jsmol


## Old release instructions

- To release a new version of jupyter_jsmol on PyPI:

Update _version.py (set release version, remove 'dev')
git add the _version.py file and git commit
`python setup.py sdist upload`
`python setup.py bdist_wheel upload`
`git tag -a X.X.X -m 'comment'`
Update _version.py (add 'dev' and increment minor)
git add and git commit
git push
git push --tags

- To release a new version of jupyter-jsmol on NPM:

Update `js/package.json` with new npm package version

```
# clean out the `dist` and `node_modules` directories
git clean -fdx
npm install
npm publish
```

Jupyter notebook package for Jmol.

## Old package Install


**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save jupyter-jsmol
```


## Old MANIFEST.in
```
recursive-include jupyter_jsmol/static *.*
include jupyter-jsmol.json
```
