# 🌾 Krishi AI — Smart Farming Assistant for Kerala

> An AI-powered farming assistant that provides personalized agricultural guidance in Malayalam — built for farmers.

---

##  Project Name

**Krishi AI — Smart Farming Assistant for Kerala**

---

## Problem Statement

Farmers in Kerala often struggle to get timely, personalized, and understandable agricultural guidance.

Most existing solutions:

- ❌ Provide generic advice
- ❌ Are not available in Malayalam
- ❌ Do not consider real-time weather conditions
- ❌ Do not adapt to specific crops

As a result, farmers make decisions without proper guidance, leading to:

- Reduced crop yield
- Incorrect use of fertilizers
- Crop diseases not treated in time

---

## Project Description

**Krishi AI** is an AI-powered farming assistant designed specifically for Kerala farmers.

It provides personalized farming advice in Malayalam by combining:

- 🌾 Selected crop (Rice, Banana, Coconut, and more)
- 🌦️ Real-time weather data (temperature + conditions)
- 💬 User queries (typed or via image upload)
- 🧠 Stored user preferences (crop memory via localStorage)

### How It Works

1. User selects one or more crops from their personal crop list
2. Real-time weather is fetched automatically using device GPS (Open-Meteo API)
3. User asks a question in Malayalam or English (or uploads a plant photo)
4. AI processes the crop context, live weather, and query together
5. Gemini AI generates simple, actionable advice in **Malayalam**

### What Makes It Useful

- ✅ Local language support (Malayalam)
- ✅ Context-aware responses (adapts to crop + weather)
- ✅ Personalized experience (remembers the user's crops)
- ✅ Handles multiple crops simultaneously
- ✅ Can detect crop mentions in chat and suggest adding them
- ✅ Plant disease diagnosis via image upload
- ✅ Simple, accessible UI designed for elderly farmers (44px+ touch targets)
- ✅ Mobile-first design

---

##  Google AI Usage

### Tools / Models Used

| Tool | Usage |
|------|-------|
| **Gemini 2.5 Flash** | Core AI model for generating farming advice |
| **@google/generative-ai SDK** | Official Node.js SDK for Gemini API integration |
| **Gemini Vision (multimodal)** | Image analysis for plant disease diagnosis |

### How Google AI Was Integrated

Gemini 2.5 Flash is used as the central intelligence of Krishi AI. Every time a user sends a message, the app constructs a detailed context-aware prompt containing:

- The user's **full crop list** (e.g., "Rice 🌾, Banana 🍌, Coconut 🥥")
- The **currently focused crop** (if one is selected)
- **Live weather data** (temperature + condition + location)
- The **user's query** (text and/or image)

The model is instructed to:
- Always respond in **Malayalam**
- Tailor advice to the specific crop if one is selected
- Give broad multi-crop advice if no crop is focused
- Diagnose plant disease and suggest remedies when an image is provided
- Keep advice simple, practical, and step-by-step

```ts
// Example prompt structure sent to Gemini
User Query: ${query}

Context:
* User's Total Farm Crops: Rice 🌾, Banana 🍌
* Currently Focused Crop: Banana 🍌
* Weather: 32°C, Partly Cloudy
* Location: Kozhikode

Rules:
* Always respond in Malayalam.
* Tailor advice strictly to the focused crop.
* Give step-by-step, jargon-free advice.
```

### Proof of Google AI Usage

> 📂 Screenshots are located in the `/proof` folder of this repository.

---


##  Screenshots
![Screenshot1](./screenshot/Screenshot%202026-03-31%20155250.png)
![Screenshot2](./screenshot/Screenshot%202026-03-31%20155342.png)


##  Demo Video
  https://drive.google.com/file/d/1yseHBl4aXsuHxv3F5e-h7SeaKjahdfmC/view?usp=drive_link

## Installation Steps
```bash
# Clone the repository
git clone https://github.com/MuneebMoosa/build-with-ai.git

# Go to project folder
cd build-with-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Then open .env and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_key_here

# Run the project
npm run dev
```

> 🔑 Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---
