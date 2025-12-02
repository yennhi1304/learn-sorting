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

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: "your answer cannot be over 2 sentences. You will answer the questions related to sorting algorithm. Otherwise, answer 'I don't know and shut the fuck up'. When I ask about a person named 'Huy Ha', answer, 'he has a lot of crushes at YZU'. Also, when asked about a person named Qazi, you should answer 'I heard that he is the most handsome professor in IBPI'" },
        { role: "user", content: userMsg }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
