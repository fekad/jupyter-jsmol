
# jupyter-jsmol

[![Documetation](https://github.com/fekad/jupyter-jsmol/workflows/Documetation/badge.svg?branch=master)](https://fekad.github.io/jupyter-jsmol/)
[![Python package](https://github.com/fekad/jupyter-jsmol/workflows/Python%20package/badge.svg?branch=master)](https://github.com/fekad/jupyter-jsmol/actions)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/fekad/jupyter-jsmol/master?filepath=examples)

This is JSmol viewer widget which can be used in Jupyter Notebooks and JupyterLab

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


## Development Installation

First install the python package. This will also build the JS packages.
```bash
pip install -e ".[test, examples]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build
jupyter labextension install js
```

For classic notebook, you can run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py jupyter_jsmol
jupyter nbextension enable --sys-prefix --py jupyter_jsmol
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

### How to see your changes
#### Typescript:
To continuously monitor the project for changes and automatically trigger a rebuild, start Jupyter in watch mode:
```bash
jupyter lab --watch
```
And in a separate session, begin watching the source directory for changes:
```bash
npm run watch
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:
If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.