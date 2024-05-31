import express from "express";
import { getContent } from "./content.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/post_content", async (req, res) => {
  const { url } = req.query;
  const content = await getContent(url);

  res.status(200).send({
    status: "success",
    url,
    content,
  });
});

app.listen(PORT, () => console.log("we are live"));
