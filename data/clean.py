"""Standardize the per-sheet Markdown exports.

Reads the source-of-truth workbook and emits clean, consistent GitHub-flavored
Markdown tables (one per sheet). Normalizations applied:
  - European decimal comma between digits -> dot            ("94,7 %" -> "94.7 %")
  - space / NBSP thousands separators removed               ("90 000" -> "90000")
  - missing values (NaN/NaT/None) -> empty cell             (no more literal "nan")
  - datetimes -> ISO date                                   ("2023-03-26 00:00:00" -> "2023-03-26")
  - integral floats -> ints                                 (2360.0 -> "2360"); float precision preserved
  - unnamed/all-empty columns dropped
Thousands collapsing is deliberately narrow: it only touches a token that is
*wholly* a space-grouped number, so model names like "Nio ET5 100 kWh" or
"BMW i3 120 Ah" are never corrupted.
Run:  python clean.py   (from the data/ directory)
"""
import re
from datetime import datetime
from pathlib import Path

import pandas as pd

INFILE = "TB_test_results.xlsx"
OUTDIR = Path(".")
MANIFEST = "sheet_manifest.csv"

NBSP = " "
_GROUPED_NUM = re.compile(r"\b\d{1,3}(?: \d{3})+\b")


def clean_cell(x):
    try:
        if pd.isna(x):          # catches NaN, NaT (subclasses datetime!), None
            return ""
    except (TypeError, ValueError):
        pass
    if isinstance(x, (pd.Timestamp, datetime)):
        return x.strftime("%Y-%m-%d")
    if isinstance(x, float):
        return str(int(x)) if x.is_integer() else repr(x)  # repr = shortest round-trip
    if isinstance(x, int):
        return str(x)
    s = str(x).replace(NBSP, " ").strip()
    if s.lower() in ("nan", "nat", "none"):
        return ""
    s = re.sub(r"(?<=\d),(?=\d)", ".", s)                          # decimal comma -> dot
    s = _GROUPED_NUM.sub(lambda m: m.group(0).replace(" ", ""), s)  # "90 000" -> "90000"
    s = re.sub(r"\s{2,}", " ", s)                                   # collapse runs of spaces
    return s


def safe(name):
    return "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in name).strip("_") or "sheet"


def main():
    xls = pd.ExcelFile(INFILE)
    manifest = []
    for sheet in xls.sheet_names:
        df = pd.read_excel(INFILE, sheet_name=sheet)
        df = df.dropna(how="all").dropna(axis=1, how="all")
        df = df.loc[:, [c for c in df.columns if not str(c).startswith("Unnamed")]]
        df = df.map(clean_cell)
        df.columns = [str(c).strip() for c in df.columns]
        path = OUTDIR / f"{safe(sheet)}.md"
        path.write_text(df.to_markdown(index=False) + "\n", encoding="utf-8")
        manifest.append(
            {"sheet_name": sheet, "rows": int(df.shape[0]),
             "columns": int(df.shape[1]), "markdown_file": f"{safe(sheet)}.md"}
        )
    pd.DataFrame(manifest).to_csv(MANIFEST, index=False)
    print(f"cleaned {len(manifest)} sheets")


if __name__ == "__main__":
    main()
