package com.app.chatserver.controller;

import com.app.chatserver.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        return message; // Broadcasts to all clients in the public chatroom
    }

    @MessageMapping("/private-message")
    public void handlePrivateMessage(@Payload Message message) {
        // Sends a private message to the specific user
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        System.out.println("Private message sent: " + message.toString());
    }

    @MessageMapping("/create-room")
    public void createRoom(@Payload String roomName) {
        String sanitizedRoomName = roomName.replaceAll("[\"']", "").trim();

        // Broadcast new room creation to all clients
        simpMessagingTemplate.convertAndSend("/chatroom/new-room", sanitizedRoomName);
    }

    @MessageMapping("/room-message/{roomName}")
    public void sendMessageToRoom(@DestinationVariable String roomName, @Payload Message message) {
        simpMessagingTemplate.convertAndSend("/chatroom/" + roomName, message);
    }
}
