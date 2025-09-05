import React, { useState } from "react";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { createRoomApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const CreateRoom = () => {
  const [detail, setDetail] = useState({ roomId: "", userName: "", roomName: "" });
  const { setRoomId, setRoomName, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId.trim() === "" || detail.userName.trim() === "" || detail.roomName.trim() === "") {
      toast.error("All fields are required!");
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
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail);
        toast.success("Room Created Successfully !!");

        setCurrentUser(detail.userName);
        setRoomName(detail.roomName);
        setRoomId(detail.roomId);
        setConnected(true);

        saveJoinedRoom(detail.roomId, detail.userName, detail.roomName);

        navigate("/chat");
      } catch (error) {
        console.error(error);
        if (error.status === 400) {
          toast.error("Room already exists !!");
        } else {
          toast.error("Error in creating room");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="p-10 border dark:border-gray-700 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
      <div> <img src={chatIcon} className="w-24 mx-auto" /> </div>
        <h1 className="text-2xl font-semibold text-center">Create Room</h1>

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
        {/* roomName */}
        <div>
          <label className="block font-medium mb-2">Room Name</label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomName}
            type="text"
            name="roomName"
            placeholder="Enter a room name"
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
            placeholder="Enter a room ID"
            className="w-full dark:bg-gray-600 px-4 py-2 border rounded-full"
          />
        </div>
        <button
          onClick={createRoom}
          className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full mt-4"
        >
          Create Room
        </button>
        <div className="text-center">
        <h3>Already have a room ?</h3>
        </div>
        
        <button
            onClick={() => navigate("/join")}
            className="px-3 py-2 dark:bg-green-500 hover:dark:bg-green-800 rounded-full w-full"
          >
            Go to Join Room Page
          </button>
      </div>
    </div>
  );
};

export default CreateRoom;
