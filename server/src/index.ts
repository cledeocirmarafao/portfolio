import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { chat } from "./chat.js";

config();

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/api/chat", chat);

app.get("/", (c) => c.text("Server online."));

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT ?? 3001),
});

console.log("Server rodando em http://localhost:3001");