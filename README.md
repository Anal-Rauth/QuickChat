# 💬 QuickChat - Real-Time Chat Application

QuickChat is a **full-stack real-time chat application** that enables instant messaging, image sharing, and online/offline presence tracking.  
It’s built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO** for real-time communication, featuring JWT authentication and Cloudinary image integration.

---

## 🚀 Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Axios, Socket.io-client, React Router  
**Backend:** Node.js, Express.js, Socket.io, JWT, Bcrypt, Cloudinary, MongoDB (Mongoose)  
**Tools & Platforms:** Vercel, Cloudinary, MongoDB Atlas, Git, GitHub  

---

## ⚙️ Features

✅ **Real-Time Messaging** – Instant chat using Socket.IO with sub-150ms message delivery.  
✅ **User Authentication** – Secure JWT-based login & registration flow.  
✅ **Image Sharing** – Upload and display images via Cloudinary integration.  
✅ **Online/Offline Tracking** – Real-time user presence updates using socket connections.  
✅ **Unread Message Counters** – Tracks unseen messages until chat is opened.  
✅ **Message Seen Status** – Displays read receipts for each conversation.  
✅ **Responsive UI** – Built with Tailwind CSS for seamless use across devices.  
✅ **Scalable Backend Architecture** – Express + MongoDB setup ready for multi-instance scaling.

---

## 🔐 Authentication Flow

1. User signs up or logs in using email & password.  
2. Server generates a JWT token after successful validation.  
3. Token stored securely in localStorage & attached to Axios headers.  
4. Socket connects using the userId in the token for real-time presence.  
5. Protected routes verify tokens via backend middleware.

---

## 💬 Real-Time Messaging Flow

1. Client sends message via REST API → stored in MongoDB.  
2. Server emits a Socket.IO event to the receiver.  
3. Receiver’s chat UI updates instantly.  
4. Messages are marked “seen” when chat is opened.  

---

## 🧩 Architecture Overview

**Frontend:**  
- React Context for Auth & Chat State  
- Socket.io-client for real-time updates  
- Axios for API communication  
- Toast notifications for UX feedback  

**Backend:**  
- Express.js API with REST endpoints  
- Socket.io for real-time events  
- MongoDB with Mongoose for message persistence  
- Cloudinary for image uploads  
- JWT & Bcrypt for secure authentication  

🧠 Key Learning Outcomes

Implemented real-time communication using Socket.io.

Learned JWT-based authentication with secure headers.

Integrated Cloudinary for optimized image handling.

Designed scalable architecture ready for Redis and load balancing.

Mastered frontend-backend synchronization using React Context and Socket.io events.

📈 Future Enhancements

🔒 End-to-End Encryption for messages

🧑‍💻 Typing indicators

🗂️ Message pagination

❤️ Message reactions & threads

🎥 Voice/Video call integration

🧰 Redis adapter for horizontal scaling


Made by Anal Rauth
---


