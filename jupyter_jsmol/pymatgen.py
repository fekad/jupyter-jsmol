"""Visualization for structures using jupyter-jsmol.
"""

try:
    from pymatgen.core import Structure
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
    from pymatgen.io.cif import CifWriter

    pymatgen_loaded = True
except ImportError:
    raise RuntimeError("To use quick_view, you need to have pymatgen installed.")

from jupyter_jsmol import JsmolView


def quick_view(
    structure: Structure,
    *args,
    conventional: bool = False,
    supercell: list = [1, 1, 1],
    symprec: float = 0.01,
    angle_tolerance: float = 5.0
) -> JsmolView:
    """A function to visualize pymatgen Structure objects in jupyter notebook using jupyter_jsmol package.

    Args:
        structure: pymatgen Structure object.
        *args: Extra arguments for JSmol's load command. Eg. "{2 2 2}", "packed"
        conventional: use conventional cell. Defaults to False.
        supercell: can be used to make supercells with pymatgen.Structure.make_supercell method.
        symprec: If not none, finds the symmetry of the structure
            and writes the cif with symmetry information. Passes symprec
            to the SpacegroupAnalyzer.
        angle_tolerance: Angle tolerance for symmetry finding. Passes
            angle_tolerance to the SpacegroupAnalyzer. Used only if symprec
            is not None.

    Returns:
        A jupyter widget object.
    """

    s = structure.copy()
    if conventional:
        spga = SpacegroupAnalyzer(s, symprec=symprec, angle_tolerance=angle_tolerance)
        s = spga.get_conventional_standard_structure()

    cif = CifWriter(
        s, symprec=symprec, angle_tolerance=angle_tolerance, refine_struct=False
    )

    supercell_str = "{" + " ".join(map(str, supercell)) + "}"

    return JsmolView.from_str(str(cif), supercell_str, *args)
