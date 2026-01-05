import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Trang test xem server sống
app.get("/", (req, res) => {
  res.send("TELEGRAM BOT IS RUNNING");
});

// Nhận update từ Telegram webhook
app.post("/telegram", async (req, res) => {
  console.log("TELEGRAM UPDATE:", JSON.stringify(req.body));

  const message = req.body.message || req.body.edited_message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text.toLowerCase();

  let reply = "❓ Mình chưa hiểu. Gõ /menu để xem lệnh.";

  if (text.includes("menu") || text.includes("start")) {
    reply =
      "🚗 MENU QUẢN LÝ XE\n" +
      "• /xe <số xe> (vd: /xe 222)\n" +
      "• /chotthang mm/yyyy\n" +
      "Ví dụ: /chotthang 01/2026";
  }

  // Gửi tin nhắn trả lời
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: reply }),
  });

  res.sendStatus(200);
});

// Start server (Render tự cấp PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
