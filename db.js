import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//uri connection to the database
const uri = process.env.MONGODB_URI;

export async function connectToDb() {
  //Function to connect to the database
  try {
    mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to the Glottis Database!"
    );
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}
connectToDb().catch(console.dir);
