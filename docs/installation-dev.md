# Developer install


To install a developer version of jupyter_jsmol, you will first need to clone
the repository:

    git clone https://github.com/fekad/jupyter-jsmol
    cd jupyter-jsmol

Next, install it with a develop install using pip:

    pip install -e .


If you are planning on working on the JS/frontend code, you should also do
a link installation of the extension:

    jupyter nbextension install [--sys-prefix / --user / --system] --symlink --py jupyter_jsmol

    jupyter nbextension enable [--sys-prefix / --user / --system] --py jupyter_jsmol

with the [appropriate flag](https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#installing-and-enabling-extensions). Or, if you are using Jupyterlab:

    jupyter labextension install .

## Release

    python setup.py sdist bdist_wheel

## Other resources

- Starting point: https://github.com/jupyter-widgets/widget-ts-cookiecutter
