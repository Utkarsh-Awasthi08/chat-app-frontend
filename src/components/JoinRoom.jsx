import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinRoom = () => {
    const [detail, setDetail] = useState({ roomId: "", userName: "" });
    const [joinedRooms, setJoinedRooms] = useState([]);
    const { setRoomId, setRoomName, setCurrentUser, setConnected } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("joinedRooms")) || [];
        setJoinedRooms(stored);
    }, []);

    function handleFormInputChange(event) {
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }

    function validateForm() {
        if (detail.roomId.trim() === "" || detail.userName.trim() === "") {
            toast.error("Invalid Input !!");
            return false;
        }
        return true;
    }

    function saveJoinedRoom(roomId, userName, roomName) {
        const stored = JSON.parse(localStorage.getItem("joinedRooms")) || [];
        const exists = stored.find((r) => r.roomId === roomId);
        if (!exists) {
            const updated = [...stored, { roomId, userName, roomName }];
            localStorage.setItem("joinedRooms", JSON.stringify(updated));
            setJoinedRooms(updated);
        }
    }

    async function joinChat() {
        if (validateForm()) {
            try {
                const stored = JSON.parse(localStorage.getItem("joinedRooms")) || [];
                const exists = stored.find((r) => r.roomId === detail.roomId);
                if (!exists) {
                    const room = await joinChatApi(detail.roomId); // assumes API returns {roomId, roomName}
                    toast.success("Joined Room Successfully !!");

                    setCurrentUser(detail.userName);
                    setRoomId(room.roomId);
                    setConnected(true);
                    setRoomName(room.roomName);
                    saveJoinedRoom(room.roomId, detail.userName, room.roomName);

                    navigate("/chat");
                }
                else {
                    toast.error("You have already joined this room. Please rejoin from the list below.");
                }
            } catch (error) {
                if (error.status === 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Error in joining room");
                }
                console.log(error);
            }
        }
    }

    const rejoinRoom = async (roomId, userName, roomName) => {
        try {
            const room = await joinChatApi(roomId);
            setCurrentUser(userName);
            setRoomId(room.roomId);
            setRoomName(room.roomName);
            setConnected(true);
            toast.success(`Rejoined "${room.roomName}"`);
            navigate("/chat");
        } catch (error) {
            toast.error("Failed to rejoin room");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-2">
            <div className="p-10 border dark:border-gray-700 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
                <div> <img src={chatIcon} className="w-24 mx-auto" /> </div>
                <h1 className="text-2xl font-semibold text-center">Join Room</h1>

                {/* userName */}
                <div>
                    <label className="block font-medium mb-2">Your Name</label>
                    <input
                        onChange={handleFormInputChange}
                        value={detail.userName}
                        type="text"
                        name="userName"
                        placeholder="Enter your name"
                        className="w-full dark:bg-gray-600 px-4 py-2 border rounded-full"
                    />
                </div>

                {/* roomId */}
                <div>
                    <label className="block font-medium mb-2">Room ID</label>
                    <input
                        onChange={handleFormInputChange}
                        value={detail.roomId}
                        type="text"
                        name="roomId"
                        placeholder="Enter the room ID"
                        className="w-full dark:bg-gray-600 px-4 py-2 border rounded-full"
                    />
                </div>

                <button
                    onClick={joinChat}
                    className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full mt-4"
                >
                    Join Room
                </button>

                {/* Show previously joined */}
                {joinedRooms.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-medium mb-2">Previously Joined Rooms</h2>
                        <ul className="space-y-2">
                            {joinedRooms.map((room, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center p-2 px-3 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                    onClick={() => rejoinRoom(room.roomId, room.userName, room.roomName)}
                                >
                                    <div>
                                        <div className="font-semibold">{room.roomName}</div>
                                        <div className="text-sm text-gray-400">ID: {room.roomId} | User: {room.userName}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinRoom;
