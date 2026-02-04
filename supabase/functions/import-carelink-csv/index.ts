// Edge Function: import-carelink-csv (skeleton until US5 implements CSV logic)
// Contract: POST body { csv_content?: string, csv_base64?: string } → { entries_count, treatments_count, success }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const { csv_content, csv_base64 } = body as { csv_content?: string; csv_base64?: string }
    if (!csv_content && !csv_base64) {
      return new Response(
        JSON.stringify({ error: "Se requiere csv_content o csv_base64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    // Placeholder until US5: parse blocks, POST to Nightscout
    return new Response(
      JSON.stringify({ entries_count: 0, treatments_count: 0, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
