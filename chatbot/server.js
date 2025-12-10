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
If users want to learn how a sorting algorithm works, guide them to begin in Step Mode. Encourage them to start with a small array, since it makes each comparison and swap easier to follow.
If users want to see which algorithm is faster, direct them to Comparison Mode, where multiple algorithms run on the same input for performance comparison.
Respond naturally when users seem confused about where to begin or which mode to choose.

Here is the structure of this page:

- Algorithm dropdown (#algo): users select the sorting algorithm.
- Array size input (#size): sets the number of bars.
- Speed slider (#speed): controls playback speed.
- Generate controls (#generate and #generateBtn): users create a new array.
- Comparison Mode toggle (#compareMode): shows dual-board comparison.
- Sort / Back / Next buttons (#sortBtn, #backBtn, #nextBtn): used for step mode.
- Reset button (#resetBtn): clears and resets the visualization.

Use this structure to guide users when they ask where to begin or what each button does.
`;

const SYSTEM_THEORY =  `If the user asks where to go next after reading theory, guide them based on their goal:

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
