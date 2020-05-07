
# jupyter-jsmol

[![Documetation](https://github.com/fekad/jupyter-jsmol/workflows/Documetation/badge.svg?branch=master)](https://fekad.github.io/jupyter-jsmol/)
![Python package](https://github.com/fekad/jupyter-jsmol/workflows/Python%20package/badge.svg?branch=master)

This is JSmol viewer widget which can be used in Jupyter Nobeooks or/and Lab

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
