# TaskZen Backend - Task Management API

## 📝 Description
The backend of **TaskZen** is a robust and scalable REST API built with **Express.js** and **MongoDB**. It provides authentication, real-time task updates via **Socket.io**, and efficient task management functionalities. The API supports **CRUD operations** for tasks, user authentication with **JWT**, and real-time synchronization.

## 🌐 Live API
[TaskZen API - Live Server](https://app-taskszen-server.vercel.app/)

## 📂 GitHub Repository
[TaskZen Backend GitHub](https://github.com/web-mahadihasan/TasksZen_Server)

---

## 📖 Table of Contents
- [📝 Description](#-description)
- [🌐 Live API](#-live-api)
- [📂 GitHub Repository](#-github-repository)
- [📦 Dependencies](#-dependencies)
- [🛠 Technologies Used](#-technologies-used)
- [🚀 Installation Steps](#-installation-steps)
- [📌 API Endpoints](#-api-endpoints)
  - [🔹 Authentication](#-authentication)
  - [🔹 User Management](#-user-management)
  - [🔹 Task Management](#-task-management)
  - [🔹 Activity Log](#-activity-log)
- [🔐 Authentication](#-authentication)
- [🎯 Features](#-features)
- [📜 License](#-license)

---

## 📦 Dependencies
The backend uses the following dependencies:

```json
{
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.13.0",
  "mongoose": "^8.10.1",
  "socket.io": "^4.8.1"
}
```

---

## 🛠 Technologies Used
- **Backend Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Token (JWT)
- **Real-Time Updates:** Socket.io
- **Security:** CORS, Dotenv for environment variables

---

## 🚀 Installation Steps

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/web-mahadihasan/TasksZen_Server.git
cd TasksZen_Server
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Server
```bash
npm start
```

### 5️⃣ Test API Endpoints
Use **Postman** or **cURL** to interact with the API.

---

## 📌 API Endpoints

### 🔹 **Authentication**
#### 🔹 Generate JWT Token  
**Endpoint:** `POST /jwt`  
**Description:** Generates a JWT token for user authentication.  
**Request Body:**  
```json
{
  "email": "user@example.com"
}
```
**Response:**  
```json
{
  "token": "your_jwt_token"
}
```

---

### 🔹 **User Management**
#### 🔹 Create a New User  
**Endpoint:** `POST /users`  
**Description:** Adds a new user to the database if they don't already exist.  
**Request Body:**  
```json
{
  "userInfo": {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "photoUrl": "https://example.com/photo.jpg",
    "createAt": "2024-02-20T12:00:00Z"
  }
}
```
**Response:**  
```json
{
  "message": "User created successfully",
  "user": { "name": "John Doe", "email": "johndoe@example.com", "photoUrl": "https://example.com/photo.jpg" }
}
```

---

### 🔹 **Task Management**
#### 🔹 Get All Tasks for a User  
**Endpoint:** `GET /tasks/:email`  
**Description:** Fetches all tasks for a given user.  
**Authorization:** Requires a valid JWT token in the `Authorization` header.  
**Query Parameters:**  
- `search` *(optional)*: Search by task title  

**Example Request:**  
```http
GET /tasks/user@example.com?search=meeting
Authorization: Bearer your_jwt_token
```
**Response:**  
```json
[
  {
    "_id": "task123",
    "title": "Meeting with team",
    "description": "Discuss project roadmap",
    "category": "To-Do",
    "deadline": "2024-02-25T12:00:00Z",
    "priorityLevel": "High",
    "userEmail": "user@example.com"
  }
]
```

#### 🔹 Create a New Task  
**Endpoint:** `POST /tasks`  
**Description:** Adds a new task to the database.  
**Authorization:** Requires JWT token.  
**Request Body:**  
```json
{
  "title": "New Feature Implementation",
  "description": "Implement drag-and-drop feature",
  "category": "In Progress",
  "deadline": "2024-02-28T18:00:00Z",
  "priorityLevel": "High",
  "name": "John Doe",
  "userEmail": "user@example.com"
}
```
**Response:**  
```json
{
  "task": { "title": "New Feature Implementation", "category": "In Progress" },
  "insertedCount": 1
}
```

#### 🔹 Update a Task  
**Endpoint:** `PUT /tasks/:id`  
**Description:** Updates an existing task.  
**Authorization:** Requires JWT token.  
**Request Body:**  
```json
{
  "title": "Updated Feature",
  "category": "Done",
  "deadline": "2024-03-01T12:00:00Z"
}
```
**Response:**  
```json
{
  "message": "Task updated successfully"
}
```

#### 🔹 Delete a Task  
**Endpoint:** `DELETE /tasks/:id`  
**Description:** Deletes a task permanently.  
**Authorization:** Requires JWT token.  
**Response:**  
```json
{
  "message": "Task deleted successfully"
}
```

---

### 🔹 **Activity Log**
#### 🔹 Get User Activity  
**Endpoint:** `GET /activities/:email`  
**Description:** Fetches the latest activity logs for a user.  
**Authorization:** Requires JWT token.  
**Response:**  
```json
[
  { "title": "Task 'Design UI' was updated", "timestamp": "2024-02-20T14:00:00Z" },
  { "title": "Task 'API Integration' was deleted", "timestamp": "2024-02-19T16:00:00Z" }
]
```

#### 🔹 Log a New Activity  
**Endpoint:** `POST /activities`  
**Description:** Logs a new activity event.  
**Authorization:** Requires JWT token.  
**Request Body:**  
```json
{
  "title": "Task 'Frontend Setup' was added",
  "userEmail": "user@example.com"
}
```
**Response:**  
```json
{
  "message": "Activity logged successfully"
}
```

---

## 🔐 Authentication
- Uses **JWT tokens** for secure API access.
- Protected routes require a valid token.

---

## 🎯 Features
✅ User Authentication with JWT  
✅ Task Management (CRUD Operations)  
✅ Real-Time Updates with **Socket.io**  
✅ Secure API with **CORS** & **Environment Variables**  
✅ MongoDB Database with **Mongoose ORM**  

---

## 📜 License
This project is licensed under the **MIT License**.

---

🚀 **TaskZen Backend - Powering Task Management in Real-Time!** 🚀
```

