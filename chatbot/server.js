import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const SYSTEM_DEFAULT = `You are a sorting algorithm professor.
You're an expert in JavaScript and Python.
Explain clearly. Provide code when needed.`;

const SYSTEM_VISUALIZER = `
Users begin in Step Mode with a small array. Guide them through each operation so they learn how the sorting algorithm works.
When they understand the basics, they may switch to Comparison Mode, where multiple algorithms run on the same input to show differences in speed and efficiency.
Always start in Step Mode unless the user requests otherwise.
Respond naturally when the user is confused about buttons or where to start.
`;

// Apply middleware ONCE
app.use(cors());
app.use(express.json());

// Debug print
// console.log("Loaded key:", process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 MEMORY ARRAY (single conversation)
let history = [];

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;
    const page = req.body.page || "unknown";

    history.push({ role: "user", content: userMsg });
    if (history.length > 20) history = history.slice(-20);

    // Build system prompt
    let systemPrompt = SYSTEM_DEFAULT;  // ALWAYS included

    if (page === "sorting-visualizer") {
      systemPrompt += SYSTEM_VISUALIZER;
    }

    // Ask OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        ...history
      ]
    });

    const botReply = completion.choices[0].message.content;

    history.push({ role: "assistant", content: botReply });

    res.json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

// Optional: allow resetting the memory
app.post("/reset", (req, res) => {
  history = [];
  res.json({ reply: "Chat memory cleared." });
});

// Render uses PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
