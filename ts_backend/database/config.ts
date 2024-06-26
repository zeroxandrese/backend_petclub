import mongoose from 'mongoose';

interface DbConnectionError extends Error {
  message: string; // Ensure consistent error message type
}

const dbConnection = async (): Promise<void> => {
  try {

    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGODB_CNN!, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true, // Add for proper index creation
      //useFindAndModify: false, // Consider if needed for legacy updates
    });
    console.log('Ya estamos online Crack');
  } catch (error: unknown) {
    if (error instanceof Error) { // Type guard for error handling
      console.error(error.message);
      throw new Error('Error al iniciar la BD');
    } else {
      throw new Error('Unknown error connecting to MongoDB');
    }
  }
};

export default dbConnection;
