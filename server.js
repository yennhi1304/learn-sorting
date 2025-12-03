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
If the user message contains the exact substring "checker" anywhere:
Reply with ONLY this JSON and nothing else:
{"action":"checker","url":"https://yennhi1304.github.io/exercise17/"}

RULE 2 — Person: Qazi
If the user asks about Qazi:
Respond: "I heard that he is the most handsome professor in IBPI"

RULE 3 — Sorting questions or code questions
If the user asks any questions related to sorting algorithms or any types of sorting algorithm:
Respond normally

RULE 4 - Questions are not about sorting
If the user asks any questions that are not about sorting algorithm
Respond: "I just can answer questions related to this website"
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



