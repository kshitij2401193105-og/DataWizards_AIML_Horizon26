const { exec } = require("child_process");
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ───────────── ML TRAFFIC PREDICTION API ───────────── */

app.get("/predict-traffic", (req, res) => {

  const hour = req.query.hour;
  const day = req.query.day;
  const distance = req.query.distance;
  const src = req.query.src || "Unknown";
  const dst = req.query.dst || "Unknown";

  if (!hour || !day || !distance) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Use 'python' instead of 'python3' for Windows compatibility
  const cmd = `cd ml_model && python predict_lstm.py ${hour} ${day} ${distance} "${src}" "${dst}"`;
  console.log("Running python command:", cmd);
  exec(cmd, (error, stdout, stderr) => {

    if (error) {
      console.error("❌ ML MODEL ERROR:", error);
      console.error("STDERR:", stderr);
      return res.status(500).send("Error running ML model");
    }

    res.json({
      model: "LSTM Neural Network (Kaggle Traffic Dataset & Keras)",
      traffic_prediction: stdout.trim()
    });

  });

});


/* ───────────── GEOCODE via Nominatim ───────────── */

app.get("/api/geocode", async (req, res) => {

  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "Missing query" });

  try {

    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "User-Agent": "AIUrbanNav/1.0", "Accept-Language": "en" } }
    );

    const data = await r.json();

    if (!data.length)
      return res.status(404).json({ error: `Place not found: ${q}` });

    res.json({
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      name: data[0].display_name
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }

});


/* ───────────── ROUTING via OSRM ───────────── */

app.get("/api/route", async (req, res) => {

  const { srcLat, srcLon, dstLat, dstLon } = req.query;

  try {

    const r = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${srcLon},${srcLat};${dstLon},${dstLat}?overview=false`
    );

    const data = await r.json();

    if (data.code !== "Ok")
      return res.status(500).json({ error: "Routing failed" });

    const route = data.routes[0];

    res.json({
      distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
      durationMin: Math.round(route.duration / 60)
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }

});


/* ───────────── AI ANALYSIS via Claude ───────────── */

app.post("/api/analyze", async (req, res) => {

  const { src, dst, distKm, baseMins, hour, dayName } = req.body;

  const trafficData = [1, 1, 1, 1, 2, 4, 7, 9, 10, 8, 5, 4, 5, 5, 6, 7, 9, 10, 9, 7, 5, 4, 3, 2];
  const congIdx = trafficData[hour] || 5;

  const prompt = `You are an AI urban mobility analyst. Analyze this real driving route and return JSON only.

Route: ${src} → ${dst}
Road distance: ${distKm} km
Base drive time (no traffic): ${baseMins} min
Departure: ${hour}:00 on ${dayName}
Congestion index now: ${congIdx}/10

Return ONLY this JSON:
{
  "trafficLevel": "Low|Moderate|High|Severe",
  "trafficEmoji": "🟢|🟡|🔴|🚨",
  "delayMinutes": <number>,
  "totalTravelMinutes": <number>,
  "bestDepartureLabel": "<e.g. 11:00 AM>",
  "timeSavedMinutes": <number>,
  "parkingAvailability": <15-90>,
  "parkingStatus": "High|Medium|Low",
  "congestionReason": "<one sentence>",
  "aiTip": "<one practical travel tip>",
  "peakHours": "<e.g. 8–10 AM & 5–7 PM>",
  "lowTrafficWindow": "<e.g. 11 AM – 2 PM>",
  "mostCongestedSegment": "<road/area>",
  "avgCongestionIndex": "<e.g. 6.4>"
}`;

  try {

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }]
    });

    const text = message.content[0].text.trim().replace(/```json|```/g, "").trim();

    res.json(JSON.parse(text));

  } catch (e) {

    res.json(localFallback(src, dst, distKm, baseMins, hour, trafficData));

  }

});


/* ───────────── Local fallback if Claude fails ───────────── */

function localFallback(src, dst, distKm, baseMins, hour, trafficData) {

  const congIdx = trafficData[hour] || 5;

  const isPeak = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 20);
  const isNight = hour < 5 || hour > 22;

  let trafficLevel, trafficEmoji, delayPct;

  if (isNight) {
    trafficLevel = "Low";
    trafficEmoji = "🟢";
    delayPct = 0.03;
  }
  else if (!isPeak) {
    trafficLevel = "Moderate";
    trafficEmoji = "🟡";
    delayPct = 0.20;
  }
  else if (congIdx >= 9) {
    trafficLevel = "Severe";
    trafficEmoji = "🚨";
    delayPct = 0.65;
  }
  else {
    trafficLevel = "High";
    trafficEmoji = "🔴";
    delayPct = 0.40;
  }

  const delayMinutes = Math.round(baseMins * delayPct);

  let bestH = hour;

  for (let h = hour + 1; h < 24; h++)
    if (trafficData[h] < 5) { bestH = h; break; }

  if (bestH === hour) bestH = 11;

  const h12 = bestH % 12 || 12;
  const ampm = bestH < 12 ? "AM" : "PM";

  const parkingAvailability = Math.max(12, Math.min(88, isNight ? 80 : isPeak ? 32 : 62));

  return {
    trafficLevel,
    trafficEmoji,
    delayMinutes,
    totalTravelMinutes: baseMins + delayMinutes,
    bestDepartureLabel: `${h12}:00 ${ampm}`,
    timeSavedMinutes: Math.max(0, delayMinutes - 3),
    parkingAvailability,
    parkingStatus: parkingAvailability > 55 ? "High" : parkingAvailability > 30 ? "Medium" : "Low",
    congestionReason: isPeak
      ? `Rush hour traffic between ${src.split(",")[0]} and ${dst.split(",")[0]}.`
      : `Moderate flow on arterial roads.`,
    aiTip: `Depart at ${h12}:00 ${ampm} to save time.`,
    peakHours: "7–10 AM & 4–8 PM",
    lowTrafficWindow: "11 AM – 2 PM",
    mostCongestedSegment: `Highway near ${dst.split(",")[0]} entry`,
    avgCongestionIndex: (congIdx * 0.75 + 1.5).toFixed(1)
  };

}


/* ───────────── Root Test Route ───────────── */

app.get("/", (req, res) => {
  res.send("Backend server is working!");
});


/* ───────────── Start Server ───────────── */

app.listen(port, () => {
  console.log(`✅ AI Urban Nav backend running on http://localhost:${port}`);
});