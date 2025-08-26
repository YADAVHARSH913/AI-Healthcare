# 🏥 AI-based Healthcare OPD Booking System

## 📖 Project Overview
This project is a **Smart Healthcare Platform** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
It allows patients to **book OPD appointments online**, view **real-time hospital bed availability**, and helps hospitals manage **doctors, beds, and inventory** efficiently.  

The goal is to reduce patient waiting times, prevent overcrowding, and make hospital resource management smarter and more transparent.  

---

## 🚀 Features
- 👨‍⚕️ **Patient Portal**
  - Online OPD booking  
  - Digital queue tokens & status updates  
  - Notifications via SMS/Email/WhatsApp  

- 🏥 **Hospital Admin Panel**
  - Manage doctor availability & appointments  
  - Real-time bed allocation (ICU/General)  
  - Inventory management with low-stock alerts  

- 📊 **Analytics Dashboard**
  - OPD load statistics  
  - Bed occupancy trends  
  - Inventory usage insights  

---

## 🛠️ Tech Stack
- **Frontend:** React.js (React Router, Axios)  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Tokens)  
- **Notifications:** Twilio/Firebase (SMS/Email/WhatsApp)  
- **Analytics:** Chart.js / Recharts  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
``bash
git clone https://github.com/YADAVHARSH913/AI-Healthcare.git
cd AI-Healthcare

2. Setup Backend
``bash
 Copy
 Edit
 cd backend
 npm install
 npm run dev
3. Setup Frontend
 ``bash
  Copy
  Edit
  cd frontend
  npm install
  npm start
4. Environment Variables
Create a .env file in the backend folder with:

 ini
Copy
Edit
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
👨‍💻 Team Members
Member 1 – Backend (Authentication & APIs)

Member 2 – Backend (Database & Queue Logic)

Member 3 – Frontend (Patient Portal)

Member 4 – Frontend (Admin Dashboard)

📸 Screenshots (to be added)
Patient booking page

Admin dashboard

Analytics charts

📅 Project Status
🚧 Currently in development (Phase 1: Authentication + Database Setup).
