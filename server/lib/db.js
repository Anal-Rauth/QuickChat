import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () =>{
    try {
        // Add error handler to see connection issues
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('connected', () => console.log('Database Connected'));

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        // Connect without modifying the URI
        await mongoose.connect(uri);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error; // Re-throw to make sure the server knows there's a problem
    }
}