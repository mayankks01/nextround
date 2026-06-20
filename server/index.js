/**
 * Minimal local proxy for the Anthropic API.
 *
 * Why this exists: src/lib/claude.js calls https://api.anthropic.com directly
 * from the browser. That only works inside the Claude.ai artifact sandbox
 * (which injects auth and proxies the request for you). Running this app as
 * a normal Vite project, a direct browser → api.anthropic.com call will be
 * blocked (no CORS support, and you'd be exposing your API key to anyone
 * who opens devtools).
 *
 * This tiny server solves both problems: it runs on your machine, holds the
 * real API key in an environment variable (never sent to the browser), and
 * forwards requests from the frontend.
 *
 * Setup:
 *   1. cp .env.example .env   (then paste your key into .env)
 *   2. npm install express cors dotenv
 *   3. node server/index.js
 *   4. In src/lib/claude.js, change the fetch URL to:
 *        http://localhost:3001/api/messages
 */

import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const HUGGINGFACE_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || "deepseek-ai/DeepSeek-R1:fastest";

app.post("/api/messages", async (req, res) => {
  // Prefer Anthropic if provided (original behavior)
  if (ANTHROPIC_KEY) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      console.error("Proxy error (Anthropic):", err);
      return res.status(500).json({ error: "Failed to reach Anthropic API" });
    }
  }

  // Fallback: if Hugging Face key is provided, forward to HF Inference API
  if (HUGGINGFACE_KEY) {
    try {
      const { system, messages, max_tokens } = req.body || {};
      const chatMessages = [];

      if (system) {
        chatMessages.push({ role: "system", content: system });
      }

      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          chatMessages.push({
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.content || "",
          });
        });
      }

      const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_KEY}`,
        },
        body: JSON.stringify({
          model: HUGGINGFACE_MODEL,
          messages: chatMessages,
          max_tokens: max_tokens || 256,
          stream: false,
        }),
      });

      const contentType = hfResponse.headers.get("content-type") || "";
      const hfData = contentType.includes("application/json")
        ? await hfResponse.json()
        : { error: await hfResponse.text() };
      if (!hfResponse.ok) {
        return res.status(hfResponse.status).json(hfData);
      }

      const text = hfData?.choices?.[0]?.message?.content || "";
      return res.status(200).json({ content: [{ text }] });
    } catch (err) {
      console.error("Proxy error (Hugging Face):", err);
      return res.status(500).json({ error: "Failed to reach Hugging Face Inference API" });
    }
  }

  // No supported key provided
  return res.status(500).json({ error: "No API key configured. Set ANTHROPIC_API_KEY or HUGGINGFACE_API_KEY in .env." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`NextRound API proxy running on http://localhost:${PORT}`);
});
