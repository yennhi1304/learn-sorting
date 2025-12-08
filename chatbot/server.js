import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Apply middleware ONCE
app.use(cors());
app.use(express.json());

// Debug print
console.log("Loaded key:", process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 MEMORY ARRAY (single conversation)
let history = [];

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    // Save user's message in memory
    history.push({ role: "user", content: userMsg });

    // Limit memory to the last 20 messages
    if (history.length > 20) {
      history = history.slice(-20);
    }

    // Ask OpenAI with full memory included
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `
You are a sorting algorithm professor.
You're an expert in JavaScript and Python.
Explain clearly. Provide code when needed.
`
        },
        ...history // <-- inject conversation history here
      ]
    });

    const botReply = completion.choices[0].message.content;

    // Save assistant reply to memory as well
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
