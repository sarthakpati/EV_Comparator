import pandas as pd
from pathlib import Path

infile = 'TB_test_results.xlsx'
outdir = Path('output')
outdir.mkdir(exist_ok=True)

xls = pd.ExcelFile(infile)
manifest = []
for sheet in xls.sheet_names:
    df = pd.read_excel(infile, sheet_name=sheet)
    df = df.dropna(how='all').dropna(axis=1, how='all')
    md = df.to_markdown(index=False)
    safe = ''.join(c if c.isalnum() or c in ('-','_') else '_' for c in sheet).strip('_') or 'sheet'
    path = outdir / f'{safe}.md'
    path.write_text(md, encoding='utf-8')
    manifest.append({'sheet_name': sheet, 'rows': int(df.shape[0]), 'columns': int(df.shape[1]), 'markdown_file': str(path)})

pd.DataFrame(manifest).to_csv(outdir / 'sheet_manifest.csv', index=False)
