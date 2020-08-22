"""Visualization for structures using jupyter-jsmol.
"""

try:
    from pymatgen import Structure
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
    pymatgen_loaded = True
except ImportError:
    raise RuntimeError('To use quick_view, you need to have pymatgen installed.')

from jupyter_jsmol import JsmolView

def quick_view(structure: Structure, conventional: bool = False, supercell: list = None) -> JsmolView:
    """A function to visualize pymatgen Structure objects in jupyter notebook using jupyter_jsmol package.

    Args:
        structure: pymatgen Structure object.
        conventional: use conventional cell. Defaults to False.
        transform: can be used to make supercells with pymatgen.Structure.make_supercell method.

    Returns:
        A jupyter widget object.
    """

    s = structure.copy()
    if conventional:
        s = SpacegroupAnalyzer(s).get_conventional_standard_structure()

    if supercell:
        s.make_supercell(supercell)

    return JsmolView.from_str(s.to('cif'))