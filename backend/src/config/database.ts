import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`📡 MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error al conectar con MongoDB: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
