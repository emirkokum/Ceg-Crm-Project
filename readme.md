# CEG-CRM

**AI-Powered Customer Relationship Management System**

CEG-CRM is a modern CRM solution that includes user management, customer profile tracking, sales management, and an AI-powered ticket/complaint prediction system.
The project provides a complete structure with **role-based authorization**, **AI-integrated ticket management**, and **customer interaction tracking**.

## Features

* 🔐 **User, Role & Authorization Management**
* 🎫 **AI-Driven Ticket & Complaint Prediction System**
* 👥 **Customer Profile & Interaction Management**
* 📊 **Sales and Lead Tracking Modules**
* 🤖 **FastAPI-based AI service for complaint resolution prediction**

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/GorkemPalali/Ceg-Crm-Project
```

## Backend Setup (.NET)

### Navigate to Backend Directory

```bash
cd CegCRMAPI/CegCRMAPI
```

### Install Dependencies

```bash
dotnet build
```

### Run the Backend

```bash
dotnet run
```

## AI Service Setup (FastAPI)

### Navigate to AI Directory

```bash
cd CegCRMAPI/CegCRMAi
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the AI Service

```bash
uvicorn main:app --reload
```

## Frontend Setup (React)

### Navigate to Frontend Directory

```bash
cd CegCRMAPI/CegCRMClient
```

### Install Dependencies

```bash
npm install
```

### Run the Frontend

```bash
npm run dev
```

## System Diagram

![System-Diagram](https://github.com/user-attachments/assets/98353781-40f5-4e37-99c9-49f21148db78)

## License

This project is developed as a graduation project. You may customize or extend it as needed.
