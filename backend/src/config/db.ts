import mongoose from "mongoose";

const connectDB = async () => {
try {
    // Toma la URI de tu archivo .env o de las variables de entorno
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`📡 MongoDB conectado: ${conn.connection.host}`);
} catch (error) {
    console.error(`❌ Error de conexión: ${error}`);
    process.exit(1); // Detiene la aplicación si la conexión falla
}
};

export default connectDB;
