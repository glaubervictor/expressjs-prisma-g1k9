import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/artists", async (req, res) => {
  const artists = await prisma.artist.findMany();
  res.json(artists);
});

app.post("/artist", async (req, res) => {
  const { name } = req.body;
  const artist = await prisma.artist.create({
    data: {
      name
    },
  });

  return res.json(artist);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
