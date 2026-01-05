import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ==============================
// LƯU TRẠNG THÁI THEO CHAT
// ==============================
const sessions = {};

// ==============================
// TEST SERVER SỐNG
// ==============================
app.get("/", (req, res) => {
  res.send("BOT ZALO XE IS RUNNING");
});

// ==============================
// TELEGRAM WEBHOOK
// ==============================
app.post("/telegram", async (req, res) => {
  console.log("TELEGRAM UPDATE:", JSON.stringify(req.body));

  const message = req.body.message || req.body.edited_message;
  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text.toLowerCase().trim();

  let reply = "❓ Mình chưa hiểu. Gõ /menu để xem lệnh.";

  // ==========================
  // MENU
  // ==========================
  if (text === "/start" || text === "/menu") {
    reply =
      "🚗 MENU QUẢN LÝ XE\n" +
      "/xe <số xe> (vd: /xe 222)\n" +
      "/chotthang mm/yyyy\n" +
      "Ví dụ: /chotthang 01/2026";
  }

  // ==========================
  // BẮT ĐẦU NHẬP XE
  // ==========================
  else if (text.startsWith("/xe")) {
    const parts = text.split(" ");
    if (parts.length < 2) {
      reply = "❌ Nhập thiếu số xe. Ví dụ: /xe 222";
    } else {
      const soXe = parts[1];
      sessions[chatId] = {
        step: "ngay",
        soXe,
        data: {},
      };
      reply = `🚗 Xe ${soXe}\n👉 Nhập ngày (dd/mm/yyyy):`;
    }
  }

  // ==========================
  // NHẬP DỮ LIỆU THEO BƯỚC
  // ==========================
  else if (sessions[chatId]) {
    const s = sessions[chatId];

    if (s.step === "ngay") {
      s.data.ngay = message.text;
      s.step = "km";
      reply = "👉 Nhập số km:";
    } 
    else if (s.step === "km") {
      s.data.km = message.text;
      s.step = "dau";
      reply = "👉 Nhập số lít dầu:";
    } 
    else if (s.step === "dau") {
      s.data.dau = message.text;
      s.step = "diadiem";
      reply = "👉 Nhập địa điểm:";
    } 
    else if (s.step === "diadiem") {
      s.data.diadiem = message.text;

      reply =
        `✅ ĐÃ LƯU CHUYẾN XE ${s.soXe}\n` +
        `📅 Ngày: ${s.data.ngay}\n` +
        `📏 Km: ${s.data.km}\n` +
        `⛽ Dầu: ${s.data.dau}\n` +
        `📍 Địa điểm: ${s.data.diadiem}`;

      delete sessions[chatId];
    }
  }

  // ==========================
  // GỬI TIN NHẮN VỀ TELEGRAM
  // ==========================
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    }
  );

  res.sendStatus(200);
});

// ==============================
// KHỞI ĐỘNG SERVER
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
