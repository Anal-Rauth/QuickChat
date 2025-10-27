import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const [isDeleting, setIsDeleting] = useState(false)

    const {socket, axios, authUser} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to delete message with proper error handling
    const deleteMessage = async (messageId) => {
        if (!socket?.connected) {
            toast.error("Not connected to chat server");
            return;
        }

        if (isDeleting) {
            return; // Prevent multiple delete requests
        }

        try {
            setIsDeleting(true);
            const {data} = await axios.delete(`/api/messages/delete/${messageId}`);
            
            if(data.success){
                setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
                toast.success("Message deleted");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Delete message error:", error);
            toast.error("Failed to delete message");
        } finally {
            setIsDeleting(false);
        }
    };

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket?.connected) return;

        // Clean up existing listeners
        socket.off("newMessage");
        socket.off("messageDeleted");

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, 
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        });

        socket.on("messageDeleted", (messageId) => {
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        });
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, 
        unseenMessages, setUnseenMessages, deleteMessage, isDeleting
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
}