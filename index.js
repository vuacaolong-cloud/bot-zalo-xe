import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ================== TELEGRAM CONFIG ==================
const TELEGRAM_TOKEN = "AAGkjrj2yz7SQ8iZe8OeJuFj9HrcvCKHGH4";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// ================== TEST SERVER ==================
app.get("/", (req, res) => {
  res.send("BOT TELEGRAM XE IS RUNNING");
});

// ================== TELEGRAM WEBHOOK ==================
app.post("/telegram", async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  let reply = "Lệnh không hợp lệ";

  if (text === "/start" || text === "/menu") {
    reply =
      "🚗 MENU QUẢN LÝ XE\n" +
      "• Gõ: /xe <số xe>\n" +
      "Ví dụ: /xe 222\n\n" +
      "• Gõ: /chotthang mm/yyyy\n" +
      "Ví dụ: /chotthang 01/2026";
  }

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
    }),
  });

  res.sendStatus(200);
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
