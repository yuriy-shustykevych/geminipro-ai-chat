import express from "express";
import cors from "cors";
import "dotenv/config";
import { env } from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = 8000;

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY);

app.post("/gemini", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: req.body.history,
  });

  const msg = req.body.message;

  const result = await chat.sendMessage(msg);

  const response = result.response;

  const text = response.text();

  res.send(text);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
