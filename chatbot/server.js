import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const SYSTEM_DEFAULT = `You are a clear and concise sorting-algorithm instructor with expertise in JavaScript and Python.
Explain concepts simply, and keep all responses brief by default — whether answering technical questions or guiding users around the webpage.
Provide longer explanations or code only when necessary or when the user requests them.`;

const SYSTEM_VISUALIZER = `
You are assisting the user on the Sorting Visualizer page.
Keep all answers brief unless the user asks for more detail.
Guidance rules:
If the user wants to understand how an algorithm works, direct them to Step Mode.
Tell them to start with a small array so each operation is easy to see.
In Step Mode: they generate an array, choose an algorithm, and use Sort, Next, and Back to walk through each step.
The Step Mode button (#autoBtn) toggles between Step Mode and Auto Mode. Step Mode disables comparison mode and shows the Next/Back buttons.
If the user wants to compare which algorithm is faster, direct them to Comparison Mode.
Both algorithms run on the same input, allowing visual performance comparison.
Page structure you can reference when guiding users:
Algorithm dropdown (#algo)
Array Size
Speed slider
Generate Array options + button
Step Mode buttons: Sort, Back, Next
Step Mode toggle
Comparison Mode toggle
Reset button
Respond clearly and naturally when the user is confused about where to start or what each control does.`;

const SYSTEM_THEORY = `If the user asks where to go next after reading theory, guide them based on their goal:
If they want to see how the algorithm works step by step, direct them to the Sorting Visualizer.
If they want to practice writing the algorithm themselves, direct them to the Code Editor Mode.
Respond naturally and help them choose the most suitable next step.`;

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
    else if (page === "theory") {
      systemPrompt += SYSTEM_THEORY;
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
