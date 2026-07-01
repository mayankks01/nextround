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
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

/* --- OAuth routes (Google, GitHub) --- */
app.get('/auth/:provider', (req, res)=>{
  const provider = req.params.provider;
  const base = `http://localhost:${PORT}`;
  if(provider==='google'){
    if(!GOOGLE_CLIENT_ID) return res.status(500).send('Google OAuth not configured (set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).');
    const redirect = encodeURIComponent(`${base}/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=${scope}&access_type=online&prompt=select_account`;
    return res.redirect(url);
  }
  if(provider==='github'){
    if(!GITHUB_CLIENT_ID) return res.status(500).send('GitHub OAuth not configured (set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET).');
    const redirect = encodeURIComponent(`${base}/auth/github/callback`);
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirect}&scope=user:email`;
    return res.redirect(url);
  }
  return res.status(404).send('Unknown provider');
});

app.get('/auth/:provider/callback', async (req, res)=>{
  const { provider } = req.params;
  const code = req.query.code;
  const base = `http://localhost:${PORT}`;
  try{
    if(provider==='google'){
      if(!GOOGLE_CLIENT_ID||!GOOGLE_CLIENT_SECRET) return res.status(500).send('Google OAuth not configured.');
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({code,client_id:GOOGLE_CLIENT_ID,client_secret:GOOGLE_CLIENT_SECRET,redirect_uri:`${base}/auth/google/callback`,grant_type:'authorization_code'})
      });
      const tokenJson = await tokenRes.json();
      const access = tokenJson.access_token;
      if(!access) return res.status(500).send('Failed to obtain Google access token');
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {headers:{Authorization:`Bearer ${access}`}});
      const user = await userRes.json();
      const name = user.name || user.given_name || user.email.split('@')[0];
      const email = user.email;
      return res.send(`<!doctype html><html><body><script>window.opener.postMessage({type:'oauth',provider:'google',user:{name:${JSON.stringify(name)},email:${JSON.stringify(email)}}},'*');window.close();</script></body></html>`);
    }

    if(provider==='github'){
      if(!GITHUB_CLIENT_ID||!GITHUB_CLIENT_SECRET) return res.status(500).send('GitHub OAuth not configured.');
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({client_id:GITHUB_CLIENT_ID,client_secret:GITHUB_CLIENT_SECRET,code,redirect_uri:`${base}/auth/github/callback`})
      });
      const tokenJson = await tokenRes.json();
      const access = tokenJson.access_token;
      if(!access) return res.status(500).send('Failed to obtain GitHub access token');
      const userRes = await fetch('https://api.github.com/user', {headers:{Authorization:`token ${access}`, 'User-Agent':'NextRound'}});
      const user = await userRes.json();
      // email may be missing; try /user/emails
      let email = user.email;
      if(!email){
        const emailsRes = await fetch('https://api.github.com/user/emails', {headers:{Authorization:`token ${access}`, 'User-Agent':'NextRound'}});
        const emails = await emailsRes.json();
        if(Array.isArray(emails)){
          const primary = emails.find(e=>e.primary) || emails[0];
          email = primary && primary.email;
        }
      }
      const name = user.name || user.login || (email?email.split('@')[0]:'GitHub User');
      return res.send(`<!doctype html><html><body><script>window.opener.postMessage({type:'oauth',provider:'github',user:{name:${JSON.stringify(name)},email:${JSON.stringify(email || '')}}},'*');window.close();</script></body></html>`);
    }
    return res.status(404).send('Unknown provider');
  }catch(err){
    console.error('OAuth callback error', err);
    return res.status(500).send('OAuth callback failed');
  }
});
