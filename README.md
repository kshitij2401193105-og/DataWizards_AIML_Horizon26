# Urban Nav — AI Smart Navigation System

## Project Structure
```
urbanav/
├── backend/
│   ├── server.js       ← Express API server
│   └── package.json
└── public/
    └── index.html      ← Frontend (also works standalone)
```

## Quick Start

### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Set your Anthropic API key
```bash
# Windows
set ANTHROPIC_API_KEY=sk-ant-your-key-here

# Mac / Linux
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Start the backend
```bash
node server.js
# ✅ AI Urban Nav backend running on http://localhost:3001
```

### 4. Open the frontend
Open `public/index.html` in your browser  
**OR** visit http://localhost:3001 (backend serves it too)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/geocode?q=Mumbai` | Convert city name → lat/lon |
| GET | `/api/route?srcLat=...&srcLon=...&dstLat=...&dstLon=...` | Real road distance + drive time |
| POST | `/api/analyze` | Claude AI traffic analysis |

### POST /api/analyze — Request body
```json
{
  "src": "Mumbai",
  "dst": "Pune",
  "distKm": 149.2,
  "baseMins": 152,
  "hour": 9,
  "dayName": "Tuesday"
}
```

### POST /api/analyze — Response
```json
{
  "trafficLevel": "High",
  "trafficEmoji": "🔴",
  "delayMinutes": 38,
  "totalTravelMinutes": 190,
  "bestDepartureLabel": "11:00 AM",
  "timeSavedMinutes": 35,
  "parkingAvailability": 45,
  "parkingStatus": "Medium",
  "congestionReason": "Morning rush on Mumbai–Pune Expressway near Khopoli.",
  "aiTip": "Depart at 11 AM to avoid Expressway peak congestion.",
  "peakHours": "7–10 AM & 5–8 PM",
  "lowTrafficWindow": "11 AM – 2 PM",
  "mostCongestedSegment": "Khopoli Ghat Section, NH-48",
  "avgCongestionIndex": "6.8"
}
```

## How It Works
1. **Geocoding** — OpenStreetMap Nominatim converts city names to coordinates (free, no key)
2. **Routing** — OSRM calculates real road distance and base drive time (free, no key)
3. **AI Analysis** — Claude AI generates traffic insights, best departure time, parking estimates
4. **Fallback** — If backend is offline, the frontend uses a built-in smart traffic model

## Try These Routes
- Mumbai → Pune
- Delhi → Agra  
- London → Manchester
- New York → Boston
- Bangalore → Chennai
- Paris → Lyon
