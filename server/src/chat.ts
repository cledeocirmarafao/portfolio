import { Hono } from "hono";
import Groq from "groq-sdk";
import { portfolioContext } from "./context.js";

const chat = new Hono();

chat.post("/", async (c) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { message, history } = await c.req.json();

    if (!message) {
      return c.json({ error: "Mensagem não informada." }, 400);
    }

    const messages = [
      { role: "system" as const, content: portfolioContext },
      ...(history ?? []),
      { role: "user" as const, content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    return c.json({ reply });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao processar mensagem." }, 500);
  }
});

export { chat };
