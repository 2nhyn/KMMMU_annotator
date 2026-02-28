import Papa from 'papaparse'

export function upsertAnnotation(currentRows, nextRow) {
  const map = new Map(currentRows.map((row) => [String(row.item_id), row]))
  map.set(String(nextRow.item_id), nextRow)
  return Array.from(map.values())
}

export function mergeRowsByItemId(existingRows, currentRows) {
  const merged = new Map()

  existingRows.forEach((row) => {
    merged.set(String(row.item_id), { ...row })
  })

  currentRows.forEach((row) => {
    const key = String(row.item_id)
    const previous = merged.get(key) || {}
    merged.set(key, { ...previous, ...row })
  })

  return Array.from(merged.values())
}

const EXPORT_COLS = [
  "item_id",
  "annotator_id",
  "response_parse_check",
  "response_gold_compare",
  "parse_gold_compare",
  "question_type_match",
  "visual_type_check",
  "comment",
  "time_spent_sec",
  "updated_at",
];

export function toCsvText(rows) {
  return Papa.unparse(rows, { columns: EXPORT_COLS });
}

// export function toCsvText(rows) {
//   return Papa.unparse(rows)
// }

export function downloadCsv(rows, fileName) {
  const csvText = toCsvText(rows)
  const blob = new Blob(['\uFEFF' + csvText], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
