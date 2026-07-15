# 🏥 MediQueue — Smart Patient Queue Management System

MediQueue is a full-stack hospital queue management application that prioritizes patients according to medical severity. It helps manage patient registration, queue order, status updates, and patient records through a simple and responsive interface.

## 🌐 Live Demo

🚀 **Live Application:**  
https://mediqueue-cyan.vercel.app

## ✨ Features

- Register new patients with their name, age, symptoms, and medical severity
- Automatically generate a unique token number for every patient
- Prioritize patients according to medical severity
- Display patients in an organized hospital queue
- Call the next patient and update their status
- Mark patients as completed
- Edit patient details such as:
  - Full name
  - Age
  - Symptoms
  - Severity level
- Delete patient records
- Store and update patient information permanently in a PostgreSQL database
- Responsive and user-friendly interface
- Fully deployed frontend and backend

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Vite

### Backend

- Node.js
- Express.js
- REST API

### Database

- PostgreSQL
- Neon Database

### Deployment

- Vercel — Frontend deployment
- Render — Backend deployment
- GitHub — Version control and source-code hosting

## ⚙️ How MediQueue Works

1. A patient enters their details through the registration form.
2. The system automatically generates a unique token number.
3. The patient is added to the hospital queue.
4. Patients are prioritized according to their medical severity.
5. Hospital staff can call a patient and change their status to **In Progress**.
6. Patient information can be edited and updated.
7. After treatment, the patient can be marked as **Completed**.
8. Patient records can be deleted when they are no longer required.

## 📊 Medical Severity Levels

| Severity | Priority |
|---|---|
| Severity 5 | Emergency |
| Severity 4 | Critical |
| Severity 3 | Urgent |
| Severity 2 | Moderate |
| Severity 1 | Low |

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients` | Fetch all patients |
| POST | `/api/patients` | Add a new patient |
| PUT | `/api/patients/:id` | Edit patient details |
| PATCH | `/api/patients/:id/status` | Update patient status |
| DELETE | `/api/patients/:id` | Delete a patient |

## 📁 Project Structure

```text
MEDIQUEUE/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── axiosClient.js
│   └── package.json
│
└── README.md