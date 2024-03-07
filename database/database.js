
const mongoose = require('mongoose');

// Function to connect to MongoDB Atlas
async function connectToMongoDBAtlas() {
  // Replace the connection string with your MongoDB Atlas connection string
  const atlasConnectionUri = process.env.DB || 'mongodb+srv://abdulhafis2847:pious2847@managementsystem.xc5xoxl.mongodb.net/'

  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas');

    // Optionally, return the mongoose connection object if needed
    return mongoose.connection;

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

// Export the connectToMongoDBAtlas function
module.exports = connectToMongoDBAtlas;
