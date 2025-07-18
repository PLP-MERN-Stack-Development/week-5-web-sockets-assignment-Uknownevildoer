The project name is ChatBox
# Real-Time Chat Application

A full-stack real-time chat application built with React frontend and Node.js backend.

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB with Mongoose - Database
- Socket.io - Real-time communication
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing

### Frontend
- React - UI framework
- React Router DOM - Client-side routing
- Socket.io-client - Real-time communication
- Axios - HTTP client
- Tailwind CSS - Styling
- jwt-decode - JWT token decoding

## Features

- User authentication (login/register)
- Real-time messaging
- Multiple chat rooms
- Online user status
- Typing indicators
- Responsive design

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

4. Make sure MongoDB is running on your system

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

4. Start the frontend development server:
```bash
npm run dev
```

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Start chatting in real-time!

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/chat/rooms` - Get all chat rooms
- `POST /api/chat/rooms` - Create a new room
- `GET /api/chat/rooms/:roomId/messages` - Get messages for a room

## Socket Events

- `message:send` - Send a new message
- `message:new` - Receive a new message
- `room:join` - Join a chat room
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `users:update` - Update online users list
