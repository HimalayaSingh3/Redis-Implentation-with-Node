const express = require("express");
const dotenv = require("dotenv");
const redisClient = require("./controllers/redis");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/data", async (req, res) => {
  try {
    const cachedData = await redisClient.get("sum");
    if (cachedData) {
      return res.status(200).json({ data: cachedData, source: "cache" });
    }

    const Sum = await computeSum();

    await redisClient.setEx("sum", 60, Sum.toString());

    res.status(200).json({ data: Sum, source: "sum" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function computeSum() {
  return new Promise((resolve) => {
    setImmediate(() => {
      let start = 0;
      for (let i = 0; i <= 10000000000; i++) {
        start += i;
      }
      resolve(start);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
