import express from "express";
import { getContent } from "./content.js";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Received webhook:", req.body);
  res.sendStatus(200);
});

app.get("/get-html", async (req, res) => {
  const { url } = req.query;
  const html = await getContent(url);
  res.set("Content-Type", "text/html");
  res.send(html);
});

app.listen(PORT, () => console.log("we are live", PORT));
