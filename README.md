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
### Prerequisites

- Java 17 or later
- Maven 3.x
- npm or yarn

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

## Usage

### Main Chat Room

1. **Send a Message in Main Chat Room**
   - Navigate to the chat application.
   - Enter your username and click "Connect".
   - Select the "Chat room" tab.
   - Type your message in the input box and click "Send".


### Room Creation and Switching

1. **Create a New Room**
   - Click on the "Create Room" button.
   - Enter the room name and click "Create".
   - The new room will be added to the member list.

2. **Switch Between Rooms**
   - Click on any room name from the member list.
   - You will enter the selected room and can send messages within that room.
  
## Demo
On the initial page, a user puts their name and connects to the chat room.
<img width="1439" alt="Screenshot 2024-07-24 at 2 55 57 PM" src="https://github.com/user-attachments/assets/55d9ecf1-2fbb-4c5b-92a3-04c44aa704bb">

After a user has connected, they can see the chat rooms and the users online.
<img width="1437" alt="Screenshot 2024-07-24 at 3 01 58 PM" src="https://github.com/user-attachments/assets/f288c015-58a8-4217-a033-175bba83e797">

Users can interact with each other on the chat page and join specific chat rooms.
<img width="1436" alt="Screenshot 2024-07-24 at 3 05 39 PM" src="https://github.com/user-attachments/assets/a8570941-fa5a-4495-a57f-1286b1fa37e9">



