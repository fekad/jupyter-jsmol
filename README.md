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

Create a dev environment:
```bash
conda create -n jupyter-jsmol-dev -c conda-forge python pip nodejs yarn jupyter jupyterlab ipywidgets jupyter-packaging==0.7.9 ase pymatgen
conda activate jupyter-jsmol-dev
```

Install the python. This will also build the TS package.

```bash
# First install the python package. This will also build the JS packages.
pip install -e ".[test, examples]"

# Run the python tests. This should not give you a few successful example tests
py.test
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
cd js
jupyter labextension develop --overwrite .
yarn run build
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
#### JavaScript:
If you use JupyterLab to develop then you can watch the source directory and run JupyterLab at the same time in different
terminals to watch for changes in the extension's source and automatically rebuild the widget.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
yarn run watch
# Run JupyterLab in another terminal
jupyter lab
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:
If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.

