// Edge Function: analyze-meal (skeleton until US2 implements Vision)
// Contract: POST body { image_url?: string, image_base64?: string } → { items, total_carbs }

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
    const { image_url, image_base64 } = body as { image_url?: string; image_base64?: string }
    if (!image_url && !image_base64) {
      return new Response(
        JSON.stringify({ error: "Se requiere image_url o image_base64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    // Placeholder until US2: GPT-4o Vision + master_food_list
    return new Response(
      JSON.stringify({ items: [], total_carbs: 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
