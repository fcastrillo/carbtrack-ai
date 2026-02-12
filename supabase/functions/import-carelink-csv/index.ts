// Edge Function: import-carelink-csv — CSV CareLink → Nightscout (per docs/csv_upload/importar_ns_v2.py)
// Contract: POST { csv_content | csv_base64 } → { entries_count, treatments_count, success, errors? }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const HEADER_PATTERN = /^Index,Date,Time,/

function findBlocks(lines: string[]): [number, number | null] | null {
  const indices: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (HEADER_PATTERN.test(lines[i])) indices.push(i)
  }
  if (indices.length === 0) return null
  if (indices.length === 1) return [indices[0], null]
  return [indices[0], indices[1]]
}

function isDataRow(line: string): boolean {
  const s = line.trim()
  if (!s) return false
  const first = s.split(",", 1)[0].trim()
  return first.length > 0 && /^\d/.test(first)
}

function parseDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    const s = `${dateStr} ${timeStr}`
    const m = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/)
    if (!m) return null
    const [, y, mo, d, h, min, sec] = m
    return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(min), Number(sec))
  } catch {
    return null
  }
}

function parseCSV(header: string, dataLines: string[]): Record<string, string>[] {
  const rows: Record<string, string>[] = []
  const keys = header.split(",").map((k) => k.trim())
  for (const line of dataLines) {
    const values = line.split(",").map((v) => v.trim())
    const row: Record<string, string> = {}
    keys.forEach((k, i) => { row[k] = values[i] ?? "" })
    rows.push(row)
  }
  return rows
}

function processTreatments(lines: string[], headerIdx: number, dataEndIdx: number): object[] {
  const header = lines[headerIdx]
  const raw = lines.slice(headerIdx + 1, dataEndIdx).filter(isDataRow)
  const rows = parseCSV(header, raw)
  const out: object[] = []
  for (const row of rows) {
    const dt = parseDateTime(row["Date"] ?? "", row["Time"] ?? "")
    if (!dt) continue
    const carbs = (row["BWZ Carb Input (grams)"] ?? "").trim()
    if (!carbs || parseFloat(carbs) <= 0) continue
    out.push({
      eventType: "Meal Bolus",
      carbs: parseFloat(carbs),
      created_at: dt.toISOString().replace(/\.\d{3}Z$/, ".000Z"),
      enteredBy: "CSV Import",
      notes: "Importado de CareLink (bloque 1)",
    })
  }
  return out
}

function processEntries(lines: string[], headerIdx: number): object[] {
  const header = lines[headerIdx]
  const raw = lines.slice(headerIdx + 1).filter(isDataRow)
  const rows = parseCSV(header, raw)
  const out: object[] = []
  for (const row of rows) {
    const dt = parseDateTime(row["Date"] ?? "", row["Time"] ?? "")
    if (!dt) continue
    const sg = (row["Sensor Glucose (mg/dL)"] ?? "").trim()
    if (!sg) continue
    let sgv: number
    try {
      sgv = Math.round(parseFloat(sg))
    } catch {
      continue
    }
    if (sgv <= 0 || sgv > 500) continue
    out.push({
      type: "sgv",
      sgv,
      date: dt.getTime(),
      dateString: dt.toISOString().replace(/\.\d{3}Z$/, ".000Z"),
      device: "Medtronic 640G",
    })
  }
  return out
}

async function postToNightscout(
  baseUrl: string,
  apiSecretHash: string,
  endpoint: "entries" | "treatments",
  batch: object[]
): Promise<{ status: number; ok: boolean }> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/v1/${endpoint}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "API-SECRET": apiSecretHash,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(batch),
  })
  return { status: res.status, ok: res.ok }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  try {
    const body = await req.json().catch(() => ({})) as { csv_content?: string; csv_base64?: string }
    let csvContent = body.csv_content
    if (!csvContent && body.csv_base64) {
      try {
        csvContent = atob(body.csv_base64)
      } catch {
        return new Response(
          JSON.stringify({ error: "csv_base64 no es base64 válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
    }
    if (!csvContent) {
      return new Response(
        JSON.stringify({ error: "Se requiere csv_content o csv_base64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const nsUrl = Deno.env.get("NIGHTSCOUT_URL")
    const nsSecret = Deno.env.get("NIGHTSCOUT_API_SECRET")
    if (!nsUrl || !nsSecret) {
      return new Response(
        JSON.stringify({ error: "NIGHTSCOUT_URL o NIGHTSCOUT_API_SECRET no configurados" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    const secretBuf = new TextEncoder().encode(nsSecret)
    const hashBuf = await crypto.subtle.digest("SHA-1", secretBuf)
    const apiSecretHash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("")

    const lines = csvContent.replace(/\r\n/g, "\n").split("\n").map((l) => l.trimEnd())
    const blocks = findBlocks(lines)
    if (!blocks) {
      return new Response(
        JSON.stringify({ error: "No se encontró encabezado 'Index,Date,Time,...' en el CSV" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    const [idx1, idx2] = blocks
    const dataEnd1 = idx2 !== null ? idx2 : lines.length

    const treatments = processTreatments(lines, idx1, dataEnd1)
    const entries = idx2 !== null ? processEntries(lines, idx2) : []

    const errors: string[] = []
    const BATCH = 100

    for (let i = 0; i < entries.length; i += BATCH) {
      const batch = entries.slice(i, i + BATCH)
      const { status, ok } = await postToNightscout(nsUrl, apiSecretHash, "entries", batch)
      if (!ok) errors.push(`entries bloque ${Math.floor(i / BATCH) + 1}: HTTP ${status}`)
    }
    for (let i = 0; i < treatments.length; i += BATCH) {
      const batch = treatments.slice(i, i + BATCH)
      const { status, ok } = await postToNightscout(nsUrl, apiSecretHash, "treatments", batch)
      if (!ok) errors.push(`treatments bloque ${Math.floor(i / BATCH) + 1}: HTTP ${status}`)
    }

    const success = errors.length === 0
    return new Response(
      JSON.stringify({
        entries_count: entries.length,
        treatments_count: treatments.length,
        success,
        ...(errors.length ? { errors } : {}),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error interno" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
