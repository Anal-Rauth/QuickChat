import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js";


// Get all users except the logged in user
export const getUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Delete message by id with proper error handling
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate message id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid message ID format" });
        }

        const message = await Message.findById(id);

        // Proper error handling for non-existent message
        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }
        
        // Ensure user can only delete their own messages
        if (message.senderId.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Unauthorized to delete this message" });
        }

        // Handle image deletion with error catching
        if (message.image) {
            try {
                const publicId = message.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError);
                // Continue with message deletion even if image deletion fails
            }
        }

        await Message.findByIdAndDelete(id);

        // Only emit to socket if connection exists
        const receiverSocketId = userSocketMap[message.receiverId.toString()];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", id);
        }

        res.json({ success: true, messageId: id });
    } catch (error) {
        console.error("Delete message error:", error);
        res.json({ success: false, message: "Failed to delete message" });
    }
};

// Send message to selected user
export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}