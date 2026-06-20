/**
 * Thin wrapper around the Anthropic Messages API.
 *
 * This calls a local proxy server (server/index.js) on localhost:3001,
 * which holds your real API key and forwards the request. This keeps your
 * key out of the browser/devtools and avoids CORS issues.
 *
 * Setup:
 *   1. cp .env.example .env   (then paste your Anthropic API key into .env)
 *   2. npm install            (installs server deps too)
 *   3. npm run server         (starts the proxy on :3001)
 *   4. npm run dev            (starts the Vite app on :5173, in another terminal)
 *
 * See README.md for the full walkthrough.
 */
const API_URL =
  import.meta.env.VITE_CLAUDE_API_URL || "http://localhost:3001/api/messages";

export async function callClaude(systemPrompt, messages, maxTokens = 1000) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Claude API error: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || data.error);
  }
  return data.content?.map((block) => block.text || "").join("") || "";
}

