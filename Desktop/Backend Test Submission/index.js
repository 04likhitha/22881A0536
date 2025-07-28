const express = require("express");
const app = express();
const port = 3000;
const Log = require("../Logging Middleware");
app.use(express.json());
// app.post("/shorturls", (req, res) => {
//   const { url, validity, shortcode } = req.body;
//   const current = new Date();
//   const expiry = new Date(current.getTime() + validity * 60 * 1000);
//   const expiryformat = expiry.toISOString();
//   res.json({
//     shortLink: `https://localhost:3000/${shortcode}`,
//     expiry: expiryformat,
//   });
// });

const sLinks = {};
app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;

  const current = new Date();
  const expiry = new Date(current.getTime() + validity * 60 * 1000);

  sLinks[shortcode] = {
    url,
    createdAt: current.toISOString(),
    expiry: expiry.toISOString(),
    clicks: 0,
    cDetails: [],
  };

  res.json({
    shortLink: `http://localhost:${port}/${shortcode}`,
    expiry: expiry.toISOString(),
  });
});

app.get("/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const data = sLinks[shortcode];

  const now = new Date();
  if (new Date(data.expiry) < now) {
    return res.status(410).json({ error: "Short link expired" });
  }

  data.clicks++;
  data.cDetails.push({
    timestamp: now.toISOString(),
    source: req.get("User-Agent"),
    location: "India",
  });

  res.redirect(data.url);
});

app.get("/shorturls/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const data = sLinks[shortcode];

  res.json({
    totalClicks: data.clicks,
    url: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.cDetails,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post("/log", (req, res) => {
  console.log("LOG RECEIVED:", req.body);
  res.json({ message: "log created successfully", logID: Date.now().toString() });
});
