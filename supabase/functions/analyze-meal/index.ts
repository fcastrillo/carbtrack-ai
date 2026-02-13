// Edge Function: analyze-meal — GPT-4o Vision + Educadies catalog cross-reference
// Contract: POST body { image_url?: string, image_base64?: string } → { items, total_carbs }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// --- Types ---

type CatalogEntry = {
  alimento: string
  ch_por_racion: number
  medida: string | null
}

type VisionItem = {
  name: string
  carbs_grams: number
  measure: string
}

type AnalyzeItem = {
  name: string
  carbs_grams: number
  measure: string
  source: "educadies" | "vision_only"
}

// --- Constants ---

const VISION_MODEL = "gpt-4o"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// --- Helpers ---

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

/** Fetch Educadies catalog from master_food_list via service role */
async function fetchCatalog(): Promise<CatalogEntry[]> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!supabaseUrl || !supabaseKey) return []

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from("master_food_list")
    .select("alimento, ch_por_racion, medida")

  if (error) {
    console.error("Error fetching catalog:", error.message)
    return []
  }
  return (data ?? []) as CatalogEntry[]
}

/** Build Vision prompt with catalog food names for better matching */
function buildPrompt(catalog: CatalogEntry[]): string {
  let catalogSection = ""
  if (catalog.length > 0) {
    const lines = catalog.map(
      (f) => `- ${f.alimento}: ${f.ch_por_racion}g CH por ${f.medida ?? "porción"}`
    )
    catalogSection = `\nCatálogo de referencia (Educadies):\n${lines.join("\n")}\n`
  }

  return `Analiza esta foto de comida. Identifica cada alimento visible y estima los gramos de carbohidratos.
${catalogSection}
Responde SOLO con JSON válido en este formato:
{
  "items": [
    { "name": "nombre del alimento", "carbs_grams": número, "measure": "porción estimada" }
  ]
}

Usa los nombres EXACTOS del catálogo cuando el alimento coincida. Para alimentos no encontrados en el catálogo, usa un nombre descriptivo en español.`
}

/** Call OpenAI Vision API — isolated for model-agnostic swap (must-arch-001) */
async function callVision(
  apiKey: string,
  imageUrl: string | undefined,
  imageBase64: string | undefined,
  catalog: CatalogEntry[]
): Promise<VisionItem[]> {
  const prompt = buildPrompt(catalog)

  // Build image content: URL directly or base64 as data URI
  const imageContentUrl = imageUrl
    ? imageUrl
    : imageBase64!.startsWith("data:")
      ? imageBase64!
      : `data:image/jpeg;base64,${imageBase64!}`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageContentUrl } },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  const content: string = data.choices?.[0]?.message?.content ?? ""

  // Extract JSON — handle markdown code blocks from OpenAI
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("OpenAI response did not contain valid JSON")
  }

  const parsed = JSON.parse(jsonMatch[0])
  return (parsed.items ?? []).map((item: Record<string, unknown>) => ({
    name: typeof item.name === "string" ? item.name : "",
    carbs_grams: typeof item.carbs_grams === "number" ? item.carbs_grams : 0,
    measure: typeof item.measure === "string" ? item.measure : "",
  }))
}

/** Tag items: educadies (catalog match → use catalog carbs) or vision_only */
function tagItems(items: VisionItem[], catalog: CatalogEntry[]): AnalyzeItem[] {
  const catalogMap = new Map<string, CatalogEntry>()
  for (const entry of catalog) {
    catalogMap.set(entry.alimento.toLowerCase(), entry)
  }

  return items.map((item) => {
    const match = catalogMap.get(item.name.toLowerCase())
    if (match) {
      return {
        name: item.name,
        carbs_grams: Number(match.ch_por_racion),
        measure: match.medida ?? item.measure,
        source: "educadies" as const,
      }
    }
    return { ...item, source: "vision_only" as const }
  })
}

// --- Main Handler ---

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { image_url, image_base64 } = body as {
      image_url?: string
      image_base64?: string
    }

    if (!image_url && !image_base64) {
      return jsonResponse({ error: "Se requiere image_url o image_base64" }, 400)
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) {
      return jsonResponse(
        { error: "Servicio de análisis no configurado. Contacte al administrador." },
        502
      )
    }

    const catalog = await fetchCatalog()
    const visionItems = await callVision(apiKey, image_url, image_base64, catalog)
    const items = tagItems(visionItems, catalog)
    const total_carbs = items.reduce((sum, i) => sum + i.carbs_grams, 0)

    return jsonResponse({ items, total_carbs })
  } catch (err) {
    console.error("analyze-meal error:", err)
    return jsonResponse(
      { error: "Error del servidor de análisis. Intente más tarde." },
      502
    )
  }
})
