# Phonebook Management System - Backend API

This is the backend API for the **Phonebook Management System**, built with **Node.js, Express.js, MongoDB, and MySQL**. It handles user authentication, phonebook management, and contact sharing.

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
  - **MySQL**: Relational database support

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Databases**: MongoDB, MySQL
- **Authentication**: JWT (JSON Web Token)
- **ORM**: Mongoose (MongoDB), Sequelize (MySQL)

## 📂 Project Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/yourusername/phonebook-backend.git
cd phonebook-backend
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables  
Create a `.env` file and add:
```sh
PORT=5000
MONGO_URI=mongodb+srv://your_mongodb_uri
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=phonebook_db
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Run the development server
```sh
npm run dev
```
Backend API will be available at **`http://localhost:5000/api`**.

## 🚀 Deployment
The API is deployed at: **[Your Deployed API URL](#)**  

---

## 📧 Contact
For inquiries, reach out to **junmanuellayese@gmail.com**.
