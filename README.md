
# jupyter-jsmol

[![Build Status](https://travis-ci.org/fekad/jupyter-jsmol.svg?branch=master)](https://travis-ci.org/fekad/jupyter_jsmol)
[![codecov](https://codecov.io/gh/fekad/jupyter-jsmol/branch/master/graph/badge.svg)](https://codecov.io/gh/fekad/jupyter-jsmol)


JSmol widget 

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
