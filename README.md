# Study Hub Chat Application

Study Hub is a real-time chat application that utilizes Spring Boot for the backend and React for the frontend. It supports public chat rooms, private messaging, and dynamic room creation.

## Features

- **Public Chat Room**: Send and receive messages in a general chat room accessible to all users.
- **Room Creation**: Create and join new chat rooms dynamically.
- **Real-time Updates**: Messages and room changes are updated in real-time using WebSocket.

## Technologies

- **Backend**: Spring Boot, WebSocket, STOMP
- **Frontend**: React, SockJS, STOMP.js
- **Database**: In-memory message storage

## Setup and Installation

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hhuss2/Study-Hub-Chat-App.git
   cd Study-Hub-Chat-App/server
   ```
2. **Build the Applicatoin**
   ```bash
   mvn clean install
   ```
3. **Run the Applicatoin**
   ```bash
   mvn spring-boot:run
   ```
The backend will start on http://localhost:8080.

### Frontend Setup
1. **Navigate to the Frontend Directory**

   ```bash
   cd ../client
   ```
2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Start the React Application**

   ```bash
   npm start
   ```
The frontend will be available at http://localhost:3000.


