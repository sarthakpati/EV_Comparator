import fs from 'fs'

/** Parse a GFM (GitHub-Flavored Markdown) table from a file.
 *  Returns an array of row objects keyed by column header.
 *  Only the FIRST table in the file is parsed.
 */
export function parseMarkdownTable(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  return parseMarkdownTableFromString(content)
}

export function parseMarkdownTableFromString(content: string): Record<string, string>[] {
  const lines = content.split('\n')
  let headerLine: string | null = null
  const rows: string[] = []
  let inTable = false
  let headerPassed = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('|')) {
      if (inTable) break // table ended
      continue
    }

    if (!inTable) {
      inTable = true
      headerLine = trimmed
      continue
    }

    // Separator row (|:---|:---|...)
    if (!headerPassed && /^\|[-: |]+\|$/.test(trimmed)) {
      headerPassed = true
      continue
    }

    if (headerPassed) {
      rows.push(trimmed)
    }
  }

  if (!headerLine || !headerPassed) return []

  const headers = parseRow(headerLine)
  return rows.map(row => {
    const cells = parseRow(row)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? '').trim()
    })
    return obj
  })
}

function parseRow(line: string): string[] {
  // Split on | but not escaped \|
  const inner = line.replace(/^\|/, '').replace(/\|$/, '')
  return inner.split('|').map(cell => cell.trim())
}
