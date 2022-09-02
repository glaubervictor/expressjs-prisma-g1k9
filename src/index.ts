import { PrismaClient } from "@prisma/client";
import express from "express";
import redis from "./lib/cache";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

const cacheKey = "artists:all";

app.get("/artists", async (req, res) => {
  try {
    const cachedArtists = await redis.get(cacheKey);

    if (cachedArtists) {
      return res.json(JSON.parse(cachedArtists));
    }

    const artists = await prisma.artist.findMany();
    await redis.set(cacheKey, JSON.stringify(artists));

    return res.json(artists);
  } catch (error) {
    return res.json({ error });
  }
});

app.post("/artist", async (req, res) => {
  const { name } = req.body;

  try {
    const artist = await prisma.artist.create({
      data: {
        name,
      },
    });

    redis.del(cacheKey);

    return res.json(artist);
  } catch (error) {
    return res.json({ error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
