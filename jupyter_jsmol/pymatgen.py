"""Visualization for structures using jupyter-jsmol.
"""

try:
    from pymatgen import Structure
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
    from pymatgen.io.cif import CifWriter

    pymatgen_loaded = True
except ImportError:
    raise RuntimeError('To use quick_view, you need to have pymatgen installed.')

from jupyter_jsmol import JsmolView

def quick_view(structure: Structure, *args, conventional: bool = False, supercell: list = None, **kwargs) -> JsmolView:
    """A function to visualize pymatgen Structure objects in jupyter notebook using jupyter_jsmol package.

    Args:
        structure: pymatgen Structure object.
        conventional: use conventional cell. Defaults to False.
        supercell: can be used to make supercells with pymatgen.Structure.make_supercell method.
        *args: Extra arguments for JSmol's load command. Eg. "{2 2 2}", "packed"
        **kwargs: Kwargs passthru to CifWriter methods. E.g., This allows
                the passing of parameters like symprec=0.01 for generation of symmetric cifs.

    Returns:
        A jupyter widget object.
    """

    s = structure.copy()
    if conventional:
        s = SpacegroupAnalyzer(s).get_conventional_standard_structure()

    if supercell:
        s.make_supercell(supercell)

    return JsmolView.from_str(str(CifWriter(s, **kwargs)), *args)