import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Connected successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.error("Database connection error:", err);
    });

    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
};

export default connectDB;
