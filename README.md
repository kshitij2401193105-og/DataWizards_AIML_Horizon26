# Urban Nav — AI Smart Navigation System

## Project Structure
```
urbanav/
├── backend/
│   ├── server.js
│   └── package.json
└── public/
    └── index.html
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
```

Backend runs at:

```
http://localhost:3001
```

### 4. Open the frontend
Open `public/index.html` in browser.

---

## API Endpoints

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/geocode?q=Mumbai` | Convert city name → coordinates |
| GET | `/api/route` | Get road distance & travel time |
| POST | `/api/analyze` | AI traffic analysis |

---

## How It Works

1. **Geocoding** — OpenStreetMap converts city names to coordinates  
2. **Routing** — OSRM calculates real road distance and drive time  
3. **AI Analysis** — Claude AI generates traffic insights  
4. **Fallback** — Frontend smart traffic model if backend fails

---

## Example Routes

- Mumbai → Pune  
- Delhi → Agra  
- London → Manchester  
- New York → Boston  
- Bangalore → Chennai  
- Paris → Lyon