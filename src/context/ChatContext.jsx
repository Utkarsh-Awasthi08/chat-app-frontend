import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("joinedRooms")) || [];
    if (stored.length > 0) {
      const last = stored[stored.length - 1]; // last joined room
      setRoomId(last.roomId);
      setRoomName(last.roomName);
      setCurrentUser(last.userName);
      setConnected(true);
    }
    setLoading(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        roomName,
        currentUser,
        connected,
        loading,
        setRoomId,
        setRoomName,
        setCurrentUser,
        setConnected,
        setLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
