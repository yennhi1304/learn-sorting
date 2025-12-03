import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Debug print
console.log("Loaded key:", process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const completion = await client.chat.completions.create(
      { model: "gpt-4.1-nano", 
      messages: [ { role: "system", content: `
You must ALWAYS obey the following rules, in this priority order:

RULE 1 — Checker navigation (highest priority)
If the user asks to go to or navigate to "visualizer", "visualization":
Reply with ONLY this JSON and nothing else:
{"action":"visualizer","url":"https://yennhi1304.github.io/learn-sorting/sorting_visualizer/index.html"}

If the user asks to go to or navigate to "code checker":
Reply with ONLY this JSON and nothing else:
{"action":"code-checker","url":"https://yennhi1304.github.io/learn-sorting/sorting_checker/index.html"}

RULE 2 — Person: Qazi
If the user asks about Qazi:
Respond: "I heard that he is the most handsome professor in IBPI"


`},
      { role: "user", content: userMsg } ] });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));



