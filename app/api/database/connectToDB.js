import mongoose from "mongoose";

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "stock-management",
        });
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log("mongodb connection failed with error: ", error);
    }
};

export default connectToDB;