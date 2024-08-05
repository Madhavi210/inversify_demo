
import dotenv from "dotenv";

dotenv.config();

export const config = {
    mongo_url : process.env.MONGODB_URI,
    port : process.env.PORT,
    secret_key : process.env.SECRET_KEY,
}

