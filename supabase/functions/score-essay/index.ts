import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { essay, taskNumber, prompt } = await req.json();

    if (!essay || typeof essay !== "string" || essay.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Essay text is required (minimum 20 characters)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert IELTS examiner with 15+ years of experience. Score the following IELTS Writing ${taskNumber === 1 ? "Task 1" : "Task 2"} essay using the official band descriptors.

Provide your assessment as a JSON object with this exact structure:
{
  "overall": <number 0.5 to 9.0 in 0.5 increments>,
  "taskAchievement": <number>,
  "coherenceCohesion": <number>,
  "lexicalResource": <number>,
  "grammaticalRange": <number>,
  "feedback": [
    {
      "criterion": "Task Achievement",
      "band": <number>,
      "descriptor": "<official band descriptor text>",
      "strengths": ["<specific strength 1>", "<specific strength 2>"],
      "improvements": ["<specific actionable improvement 1>", "<specific actionable improvement 2>"],
      "corrections": ["<specific grammar/vocabulary correction with example from the essay>"]
    },
    {
      "criterion": "Coherence & Cohesion",
      "band": <number>,
      "descriptor": "<descriptor>",
      "strengths": [],
      "improvements": [],
      "corrections": []
    },
    {
      "criterion": "Lexical Resource",
      "band": <number>,
      "descriptor": "<descriptor>",
      "strengths": [],
      "improvements": [],
      "corrections": ["Replace '<word used>' with '<better alternative>' in paragraph X"]
    },
    {
      "criterion": "Grammatical Range & Accuracy",
      "band": <number>,
      "descriptor": "<descriptor>",
      "strengths": [],
      "improvements": [],
      "corrections": ["'<incorrect sentence>' should be '<corrected sentence>'"]
    }
  ]
}

Be strict but fair. Provide specific examples from the essay in corrections. Each corrections array should have 2-4 specific items referencing actual text from the essay.`;

    const userPrompt = prompt
      ? `Task prompt: ${prompt}\n\nEssay:\n${essay}`
      : `Essay:\n${essay}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI scoring service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate the JSON response
    let scoreData;
    try {
      scoreData = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        scoreData = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse AI response");
      }
    }

    // If AI returned an array, take the first element
    if (Array.isArray(scoreData)) {
      scoreData = scoreData[0];
    }

    return new Response(JSON.stringify(scoreData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("score-essay error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
