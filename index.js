import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BOT ZALO XE IS RUNNING");
});

app.post("/webhook", (req, res) => {
  console.log("ZALO EVENT:", JSON.stringify(req.body));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
