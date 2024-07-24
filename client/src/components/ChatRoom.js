import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './ChatRoom.css';

let stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [roomChats, setRoomChats] = useState({});
    const [tab, setTab] = useState("CHATROOM");
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        receiverName: '',
        connected: false,
        message: '',
        newRoomName: ''
    });

    useEffect(() => {
        if (userData.connected) {
            connect();
        }
    }, [userData.connected]);

    useEffect(() => {
        if (tab !== "CHATROOM" && tab in roomChats) {
            subscribeToRoom(tab);
        }
    }, [tab]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData(prevUserData => ({ ...prevUserData, connected: true }));
        subscribeToChats();
        userJoin();
    }

    const subscribeToChats = () => {
        stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
        stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessageReceived);
        stompClient.subscribe('/chatroom/new-room', onNewRoomCreated);
    }

    const userJoin = () => {
        const chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const subscribeToRoom = (room) => {
        stompClient.subscribe(`/chatroom/${room}`, onRoomMessageReceived(room));
    }

    const onPublicMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (payloadData.status === "MESSAGE") {
            setPublicChats(prevChats => {
                if (!prevChats.some(chat => chat.message === payloadData.message && chat.senderName === payloadData.senderName)) {
                    return [...prevChats, payloadData];
                }
                return prevChats;
            });
        } else if (payloadData.status === "JOIN") {
            setConnectedUsers(prevUsers => {
                if (!prevUsers.includes(payloadData.senderName)) {
                    return [...prevUsers, payloadData.senderName];
                }
                return prevUsers;
            });
        }
    }

    const onPrivateMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setPrivateChats(prevChats => {
            const newChats = new Map(prevChats);
            if (newChats.has(payloadData.senderName)) {
                const existingChats = newChats.get(payloadData.senderName);
                if (!existingChats.some(chat => chat.message === payloadData.message)) {
                    existingChats.push(payloadData);
                }
                newChats.set(payloadData.senderName, existingChats);
            } else {
                newChats.set(payloadData.senderName, [payloadData]);
            }
            return newChats;
        });
    }

    const onNewRoomCreated = (payload) => {
        const newRoomName = payload.body;
        setRoomChats(prevChats => ({
            ...prevChats,
            [newRoomName]: []
        }));
        subscribeToRoom(newRoomName);
    }

    const onRoomMessageReceived = (room) => (payload) => {
        const payloadData = JSON.parse(payload.body);
        setRoomChats(prevChats => {
            const existingChats = prevChats[room] || [];
            if (!existingChats.some(chat => chat.message === payloadData.message)) {
                return {
                    ...prevChats,
                    [room]: [...existingChats, payloadData]
                };
            }
            return prevChats;
        });
    }

    const onError = (err) => {
        console.error('Error: ', err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData(prevUserData => ({ ...prevUserData, message: value }));
    }

    const handleRoomName = (event) => {
        const { value } = event.target;
        setUserData(prevUserData => ({ ...prevUserData, newRoomName: value }));
    }

    const sendPublicMessage = () => {
        if (stompClient) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData(prevUserData => ({ ...prevUserData, message: "" }));
        }
    }

    const sendPrivateMessage = () => {
        if (stompClient && userData.username !== tab) {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };
            setPrivateChats(prevChats => {
                const newChats = new Map(prevChats);
                if (newChats.has(tab)) {
                    const existingChats = newChats.get(tab);
                    if (!existingChats.some(chat => chat.message === chatMessage.message)) {
                        existingChats.push(chatMessage);
                    }
                    newChats.set(tab, existingChats);
                }
                return newChats;
            });
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData(prevUserData => ({ ...prevUserData, message: "" }));
        }
    }

    const sendRoomMessage = () => {
        if (stompClient && tab !== "CHATROOM" && tab in roomChats) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send(`/app/room-message/${tab}`, {}, JSON.stringify(chatMessage));
            setUserData(prevUserData => ({ ...prevUserData, message: "" }));
        }
    }

    const registerUser = () => {
        connect();
    }

    const createRoom = () => {
        if (stompClient && userData.newRoomName.trim()) {
            stompClient.send("/app/create-room", {}, JSON.stringify(userData.newRoomName));
            setUserData(prevUserData => ({ ...prevUserData, newRoomName: '' }));
        }
    }

    return (
        <div className="container">
            {userData.connected ? (
                <>
                    <div className="header">
                        <div className="connected-users">
                            <div className="users-label">Users online</div>
                            <select>
                                {connectedUsers.map((user, index) => (
                                    <option key={index}>{user}</option>
                                ))}
                            </select>
                        </div>
                        Study Hub
                    </div>
                    <div className="chat-box">
                        <div className="member-list">
                            <ul>
                                <li onClick={() => setTab("CHATROOM")} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                                {[...privateChats.keys()].map((name, index) => (
                                    <li onClick={() => setTab(name)} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                                ))}
                                {Object.keys(roomChats).map((room, index) => (
                                    <li onClick={() => setTab(room)} className={`member ${tab === room && "active"}`} key={index}>{room}</li>
                                ))}
                            </ul>
                        </div>
                        {tab === "CHATROOM" ? (
                            <div className="chat-content">
                                <ul className="chat-messages">
                                    {publicChats.map((chat, index) => (
                                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                            <div className="message-data">{chat.message}</div>
                                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                        </li>
                                    ))}
                                </ul>
                                <div className="send-message">
                                    <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} /> 
                                    <button type="button" className="send-button" onClick={sendPublicMessage}>Send</button>
                                </div>
                            </div>
                        ) : privateChats.has(tab) ? (
                            <div className="chat-content">
                                <ul className="chat-messages">
                                    {privateChats.get(tab).map((chat, index) => (
                                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                            <div className="message-data">{chat.message}</div>
                                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                        </li>
                                    ))}
                                </ul>
                                <div className="send-message">
                                    <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} />
                                    <button type="button" className="send-button" onClick={sendPrivateMessage}>Send</button>
                                </div>
                            </div>
                        ) : (
                            roomChats[tab] && (
                                <div className="chat-content">
                                    <ul className="chat-messages">
                                        {roomChats[tab].map((chat, index) => (
                                            <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                                {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                                <div className="message-data">{chat.message}</div>
                                                {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="send-message">
                                        <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} />
                                        <button type="button" className="send-button" onClick={sendRoomMessage}>Send</button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div className="room-creation">
                        <input type="text" placeholder="New room name" value={userData.newRoomName} onChange={handleRoomName} />
                        <button onClick={createRoom}>Create Room</button>
                    </div>
                </>
            ) : (
                <div className="initial-view">
                    <div className="header">Study Hub</div>
                    <div className="login-container">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={userData.username}
                            onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, username: e.target.value }))}
                        />
                        <button onClick={registerUser}>Connect</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatRoom;
