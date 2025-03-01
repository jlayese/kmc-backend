# Phonebook Management System - Backend API

This is the backend API for the **Phonebook Management System**, built with **Node.js, Express.js, and MongoDB**. It handles user authentication, phonebook management, and contact sharing.

## 🚀 Features

- **User Authentication** (JWT-based)
- **User Management**
  - Approve new users (Super-admin/Admin)
  - Deactivate/Delete users
  - CRUD operations for users
- **Phonebook Management**
  - CRUD operations for contacts
  - Share/unshare contacts
  - Sync contact updates across shared users
- **Database Handling**
  - **MongoDB**: NoSQL storage for flexible data

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Databases**: MongoDB, MySQL
- **Authentication**: JWT (JSON Web Token)
- **ORM**: Mongoose (MongoDB)

## 📂 Project Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/jlayese/kmc-backend.git
cd kmc-backend
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables  
Create a `.env` file and add:
```sh
MONGO_DB=mongodb+srv://your_mongodb_uri
FRONTEND_URL=http://localhost:3000
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
```

### 4️⃣ Run the development server
```sh
npm run dev
```
Backend API will be available at **[https://kmc-backend-v7yx.onrender.com/api-docs](https://kmc-backend-v7yx.onrender.com/api-docs)**.

## 🚀 Deployment
The API is deployed at: **[Your Deployed API URL](#)**  

---

## 📧 Contact
For inquiries, reach out to **junmanuellayese@gmail.com**.
