
# AQUAID – Water Scarcity Prediction and Alert System 🚰

## 🧩 Problem Statement

Water scarcity affects billions worldwide, especially in urban regions and areas with seasonal rainfall fluctuations. Current water management systems are **reactive**, informing users only **after** a shortage occurs—by then, it’s often too late for citizens or municipal bodies to act meaningfully.

Residents typically discover a water crisis only when taps run dry, leading to distress, health risks, and resource mismanagement. Municipal authorities lack reliable, **hyperlocal forecasts** to prepare or intervene in advance.

There is an urgent need for a **real-time, proactive water prediction and alert system** to help individuals and authorities **respond ahead of time**.

---

## 💡 Approach & Solution

**AQUAID** is an **AI-powered web platform** that predicts **localized water scarcity** 2–4 weeks in advance by analyzing:

- Weather data (temperature, rainfall forecasts)
- Civic water supply schedules
- Historical consumption trends
- Crowd-sourced user reports

The system generates **alerts, micro-actions**, and **data visualizations** to help both citizens and municipal bodies conserve water and plan interventions.

---

## ✨ Features

- **Hyperlocal Water Prediction:**  
  AI/ML models predict water availability at ward/street level based on real-time data.

- **Crowd-Sourced Reports:**  
  Users can report low pressure, dry taps, and issues to generate a heatmap of scarcity.

- **Early Warning Alerts:**  
  Sends automated alerts to users and authorities weeks ahead of predicted shortages.

- **Actionable Tips:**  
  Suggests personalized micro-actions like "Skip car wash this week" or "Alternate tap usage."

- **Gamification & Rewards:**  
  Leaderboards and badges to promote conservation and frequent reporting.

- **Integration with Weather APIs & Civic Data:**  
  Uses reliable sources (e.g., OpenWeatherMap, municipal schedules).

- **Offline/Low-Internet Support:**  
  Supports SMS/WhatsApp reporting for regions with limited internet access.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Wouter (routing), Tailwind CSS, Framer Motion  
- **Backend:** Node.js, Express, TypeScript  
- **Database:** SQLite (via Drizzle ORM)  
- **APIs:** RESTful endpoints for authentication, user data, weather, predictions, and reports  
- **Other Tools:** Vite, React Query, Lucide Icons, Toast Notifications

---
## 🖼️ App Screenshots

A visual preview of the AQUAID Water Scarcity Prediction and Alert System:

| Main Page 1 | Main Page 2 | Main Page 3 |
|-------------|-------------|-------------|
| ![Main1](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image2.png) | ![Main2](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image3.png) | ![Main3](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image4.png) |

| Profile | Dashboard | Report Issue |
|---------|-----------|--------------|
| ![Profile](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image1.png) | ![Dashboard](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/dashboard.png) | ![Report](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image6.png) |

| Alert Page | Water Tips | Leaderboard |
|------------|------------|-------------|
| ![Alert](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image7.png) | ![Tips](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image8.png) | ![Leaderboard](https://raw.githubusercontent.com/HitikaS/WaterWise/main/assets/image9.png) |

## 🚀 Run Instructions

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above recommended)  
- npm (v9 or above)

---

### 📦 1. Clone the Repository

```sh
git clone https://github.com/HitikaS/WaterWise.git
cd WaterWise


### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add:
```
DATABASE_URL=sqlite:./data.db
REPLIT_DOMAINS=localhost
```
(Adjust as needed for your environment)

### 4. Start the development server
```sh
npm run dev
```

- The backend will run on [http://127.0.0.1:3000](http://127.0.0.1:3000)
- The frontend will be available at the same address (Vite dev server)

### 5. Access the app
Open your browser and go to [http://localhost:3000](http://localhost:3000)


