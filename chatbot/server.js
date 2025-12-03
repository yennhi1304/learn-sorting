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
You are a sorting algorithm professor.
You are very good at coding
You can give users all kinds of sorting algorithms.

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

const cors = require("cors");
app.use(cors());
