import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Received webhook:", req.body);
  console.log("req", req);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log("we are live"));
