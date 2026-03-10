# Urban Nav — AI Smart Navigation System 🚦

Urban Nav is an **AI + Machine Learning powered smart navigation system** that predicts traffic conditions for a route and provides intelligent travel insights.

The system combines **route data, machine learning traffic prediction, and AI analysis** to estimate congestion and recommend better travel decisions.

---

# 🚀 Features

• Route distance & travel time calculation
• Machine Learning traffic prediction
• AI-powered traffic analysis
• Best departure time suggestions
• Traffic congestion insights
• Parking availability estimation

---

# 🧠 Technologies Used

Frontend
• HTML
• JavaScript

Backend
• Node.js
• Express.js

Machine Learning
• Python
• scikit-learn
• Random Forest Regressor

APIs
• OpenStreetMap (Nominatim) – Geocoding
• OSRM – Route distance calculation
• Claude AI – Traffic analysis

---

# 📂 Project Structure

```
DataWizards_AIML_Horizon26/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ml_model/
│       ├── train_model.py
│       ├── predict_traffic.py
│       ├── traffic_dataset.csv
│       └── traffic_model.pkl
│
├── public/
│   └── ai-urban-nav.html
│
└── README.md
```

---

# ⚙️ How It Works

1️⃣ User enters **source and destination**

2️⃣ Backend converts location names → **coordinates using OpenStreetMap**

3️⃣ OSRM calculates
• Route distance
• Estimated base travel time

4️⃣ Machine Learning model predicts
• **Traffic volume (vehicle count)** using

* hour of day
* day of week
* route distance

5️⃣ Claude AI analyzes route conditions and returns
• Traffic level
• Estimated delay
• Best departure time
• Parking availability
• Travel tips

---

# 🤖 Machine Learning Model

Model Used: **Random Forest Regressor (scikit-learn)**

The model predicts **traffic volume** based on:

• Hour of day
• Day of week
• Route distance

The dataset used for training is a **traffic dataset from Kaggle**.

---

# 🛠 Quick Start

## 1️⃣ Install backend dependencies

```
cd backend
npm install
```

---

## 2️⃣ Install Python dependencies

```
pip3 install pandas scikit-learn joblib
```

---

## 3️⃣ Set your Anthropic API key

Mac / Linux

```
export ANTHROPIC_API_KEY=your-api-key
```

Windows

```
set ANTHROPIC_API_KEY=your-api-key
```

---

## 4️⃣ Start the backend

```
node server.js
```

Server runs at:

```
http://localhost:3001
```

---

## 5️⃣ Open the frontend

Open in browser:

```
public/ai-urban-nav.html
```

---

# 📡 API Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/geocode?q=City` | Convert city → coordinates            |
| GET    | `/api/route`          | Get route distance & base travel time |
| GET    | `/predict-traffic`    | ML traffic prediction                 |
| POST   | `/api/analyze`        | AI traffic analysis                   |

---

# 🌍 Example Routes

• Mumbai → Pune
• Delhi → Agra
• Bangalore → Chennai
• London → Manchester
• New York → Boston

---

# 👨‍💻 Contributors

Team **DataWizards**
Project for **AIML Horizon 2026**

---

# 📌 Future Improvements

• Real-time traffic APIs
• Live map visualization
• GPS-based route tracking
• Deep learning traffic prediction
