import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import { supabaseServer } from "@/lib/supabase-server";
import {
  PROGRAM_START,
  PROGRAM_END,
  PROGRAM_DAYS,
  START_WEIGHT,
  TARGET_WEIGHT,
  START_BODY_FAT,
  getDayNumber,
  getTodayString,
} from "@/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getTavily() {
  return tavily({ apiKey: process.env.TAVILY_API_KEY! });
}

// Tool definition for Groq
const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the internet for up-to-date information about fitness, nutrition, exercises, food calories/macros, supplements, health tips, or any topic the user asks about that requires external knowledge. Use this when your built-in knowledge is insufficient or when the user asks about specific foods, exercises, products, or current information.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query. Make it specific and relevant to fitness/health context. E.g. 'calories and protein in 200g chicken breast' or 'best face massage techniques for reducing bloating'",
          },
        },
        required: ["query"],
      },
    },
  },
];

async function webSearch(query: string): Promise<string> {
  try {
    const result = await getTavily().search(query, {
      maxResults: 3,
      searchDepth: "basic",
    });

    if (!result.results || result.results.length === 0) {
      return "No results found.";
    }

    return result.results
      .map(
        (r, i) =>
          `[${i + 1}] ${r.title}\n${r.content}`
      )
      .join("\n\n");
  } catch (error) {
    console.error("Tavily search error:", error);
    return "Search failed. Answer based on your existing knowledge.";
  }
}

async function fetchContext() {
  const today = getTodayString();
  const dayNumber = getDayNumber(today);
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(PROGRAM_END).getTime() - new Date(today).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const [
    { data: todayLog },
    { data: todayTasks },
    { data: todayMeals },
    { data: measurements },
    { data: allTasks },
  ] = await Promise.all([
    supabaseServer
      .from("daily_logs")
      .select("weight_kg, body_fat_pct, energy_level, training_schedule")
      .eq("date", today)
      .maybeSingle(),
    supabaseServer
      .from("daily_tasks")
      .select("task_name, completed")
      .eq("date", today),
    supabaseServer
      .from("daily_meals")
      .select("meal_type, description")
      .eq("date", today),
    supabaseServer
      .from("measurements")
      .select("metric_name, value, unit")
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseServer
      .from("daily_tasks")
      .select("date, completed")
      .gte("date", PROGRAM_START)
      .lte("date", today)
      .order("date", { ascending: false }),
  ]);

  // Calculate streak
  let streak = 0;
  if (allTasks && allTasks.length > 0) {
    const tasksByDate: Record<string, boolean[]> = {};
    for (const t of allTasks) {
      if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
      tasksByDate[t.date].push(t.completed);
    }
    const dates = Object.keys(tasksByDate)
      .filter((d) => d < today)
      .sort((a, b) => b.localeCompare(a));
    for (const date of dates) {
      const dayTasks = tasksByDate[date];
      if (dayTasks.length > 0 && dayTasks.every(Boolean)) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Calculate consistency
  let consistency: number | null = null;
  if (allTasks && allTasks.length > 0) {
    const tasksByDate: Record<string, boolean[]> = {};
    for (const t of allTasks) {
      if (t.date < today) {
        if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
        tasksByDate[t.date].push(t.completed);
      }
    }
    const pastDates = Object.keys(tasksByDate);
    if (pastDates.length > 0) {
      const completedDays = pastDates.filter((d) =>
        tasksByDate[d].every(Boolean)
      ).length;
      consistency = Math.round((completedDays / pastDates.length) * 100);
    }
  }

  const completed = todayTasks?.filter((t) => t.completed) ?? [];
  const incomplete = todayTasks?.filter((t) => !t.completed) ?? [];

  const meals = todayMeals
    ?.map((m) => `${m.meal_type}: ${m.description}`)
    .join(", ") || "No meals logged yet";

  const lifts = measurements
    ?.reduce((acc, m) => {
      if (!acc[m.metric_name]) acc[m.metric_name] = `${m.value} ${m.unit}`;
      return acc;
    }, {} as Record<string, string>) ?? {};

  return `
LIVE DATA — Day ${dayNumber}/${PROGRAM_DAYS} (${daysLeft} days remaining)
Weight: ${todayLog?.weight_kg ?? "not logged today"}kg (Start: ${START_WEIGHT}kg → Target: ${TARGET_WEIGHT}kg, Lost: ${todayLog?.weight_kg ? (START_WEIGHT - todayLog.weight_kg).toFixed(1) : "?"}kg)
Body Fat: ${todayLog?.body_fat_pct ?? "not logged"}% (Start: ${START_BODY_FAT}%)
Energy: ${todayLog?.energy_level ?? "not set"}
Streak: ${streak} days | Consistency: ${consistency !== null ? consistency + "%" : "N/A"}
Tasks Today: ${completed.length}/${(todayTasks ?? []).length} completed
  Done: ${completed.map((t) => t.task_name).join(", ") || "none"}
  Pending: ${incomplete.map((t) => t.task_name).join(", ") || "all done"}
Meals Today: ${meals}
Lifts: ${Object.entries(lifts).map(([k, v]) => `${k}: ${v}`).join(", ") || "none logged"}
Training Schedule: ${todayLog?.training_schedule?.join(", ") ?? "not set"}
`.trim();
}

const SYSTEM_PROMPT = `You are GRIND AI — an aggressive, no-BS fitness coach embedded in a 30-day graduation cut dashboard. The trainee is Duy, cutting from ${START_WEIGHT}kg to ${TARGET_WEIGHT}kg before graduation on April 22, 2026.

YOUR PERSONALITY:
- Encouraging but real — like a tough coach who genuinely cares. Think big brother energy.
- Use the trainee's actual data to personalize every answer.
- Be warm but direct. Celebrate wins, call out slacking, always push forward.
- Use his name "Duy" naturally to make it personal.
- Add emoji sparingly for energy (💪, 🔥, ✅, ⚡, 🎯) — max 2-3 per response.

YOUR TOOLS:
- You have access to a **web_search** tool. Use it when:
  • The user asks about specific foods, calories, macros, or nutritional info you're not 100% sure about
  • The user asks about specific exercises, techniques, or form
  • The user asks about supplements, products, or brands
  • The user asks about anything that requires current/specific factual data
  • You need to verify or look up health/fitness information
- Do NOT search for things you already know well (basic fitness principles, the program rules, etc.)
- When you use search results, synthesize them naturally into your coaching response — don't just dump raw search results.

YOUR KNOWLEDGE BASE:

FACE DEBLOAT PROTOCOL (6 daily steps):
1. Morning Lemon Water (06:00) — 500ml warm water + half lemon, kickstarts lymphatic drainage
2. Chin-to-Ceiling stretches (06:30) — 3 sets of 15 reps, tightens jawline muscles
3. Fish Face exercise (07:00) — 3 sets of 20 reps, tones cheek muscles
4. Face Massage with lymphatic drainage (08:00) — 5 min, jawline to temples, reduces water retention
5. Sodium Cap after 6PM — zero added sodium after 6PM, prevents overnight bloating
6. Elevated Sleep — slight incline on pillow, drains facial fluid overnight

BLOAT TRIGGERS TO AVOID:
Alcohol, Soda, Sugary Drinks, Excess Caffeine, Processed Meats, Instant Noodles, White Bread, Fried Food, Soy Sauce (high sodium), Dairy Milk

NUTRITION RULES:
- Daily target: 180g protein / 1800 KCAL
- Default meals: Breakfast (Oats + 2 eggs + banana), Lunch (Grilled chicken + brown rice + broccoli), Dinner (Fish + sweet potato + spinach salad), Snack (Greek yogurt + almonds)
- Hydration: 3.7L water total, 2 cups green tea, 1 lemon water
- No sodium after 6PM (critical for face debloat)

TRAINING ROTATION:
- U = Upper Body, L = Lower Body, C = Cardio/Core, R = Rest
- Daily: 45 min strength training + 30 min LISS cardio
- Rest days: active recovery only (walking, stretching)

8 DAILY TASKS:
1. Morning Lemon Water (500ml)
2. Macro Target: 180g Protein / 1800 KCAL
3. Strength Training (45 min)
4. Cardio Session (30 min LISS)
5. Water Intake: 3.7L Total
6. Face Exercise & Lymphatic Massage (5 min)
7. No Sodium After 6PM
8. Sleep 8 Hours (Before 11PM)

SLEEP OPTIMIZATION:
- 8 hours minimum, in bed by 11PM
- Elevated pillow for facial drainage
- No screens 30 min before bed
- Cool room temperature (18-20°C)

RESPONSE FORMAT RULES:
- Structure your answers clearly. Use line breaks between ideas.
- For lists or steps, use bullet points with "•" or numbered lists.
- Bold key terms by wrapping them in **double asterisks** (markdown bold).
- Start with a direct answer, then add detail below.
- Keep each response 3-6 sentences unless a detailed breakdown is requested.
- When giving advice, end with a short motivational one-liner.
- Always reference the trainee's actual data when relevant.
- If asked about food, always check against the 1800 kcal / 180g protein target.
- If asked about bloating, reference the specific triggers list.
- Be supportive and structured — this is coaching, not yelling.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const context = await fetchContext();

    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n--- TRAINEE'S CURRENT STATUS ---\n${context}` },
    ];

    // Include last 10 messages of history
    if (Array.isArray(history)) {
      const recent = history.slice(-10);
      for (const msg of recent) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    // First call — may include tool calls
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      temperature: 0.7,
      tools,
      tool_choice: "auto",
      messages,
    });

    const assistantMessage = completion.choices[0]?.message;
    const content = assistantMessage?.content || "";

    // Check if the model wants to call a tool (proper tool_calls OR XML text fallback)
    const hasToolCalls = assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0;
    const xmlMatch = content.match(/<function[=(]web_search[)>][\s\S]*?(\{[^}]+\})[\s\S]*?<\/function>/);

    if (hasToolCalls || xmlMatch) {
      let searchQuery: string;

      if (hasToolCalls) {
        const args = JSON.parse(assistantMessage!.tool_calls![0].function.arguments);
        searchQuery = args.query;
      } else {
        // Parse query from XML text output
        const argsJson = JSON.parse(xmlMatch![1]);
        searchQuery = argsJson.query;
      }

      const searchResults = await webSearch(searchQuery);

      // Build a fresh second call with search results injected as context
      const secondMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "user",
          content: `[SEARCH RESULTS for "${searchQuery}"]\n${searchResults}\n\n[END SEARCH RESULTS]\n\nUsing the search results above, answer my previous question. Synthesize the information naturally into your coaching response — don't dump raw results.`,
        },
      ];

      // Remove the last user message duplicate (it's already in messages)
      // The search context is appended as a new user message
      const finalCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 512,
        temperature: 0.7,
        messages: secondMessages,
      });

      const response = finalCompletion.choices[0]?.message?.content;
      if (!response) {
        return NextResponse.json(
          { error: "No response generated" },
          { status: 500 }
        );
      }

      return NextResponse.json({ response, searched: true });
    }

    // No tool call — direct response
    if (!content) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
