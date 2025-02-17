import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/gestor_productos");
        console.log(`📡 MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
