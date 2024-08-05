import { Types } from "mongoose";
import { userRole } from "../enum/role";

export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    token: string | null ;
    profilePic: string;
    permissionRoles:  Types.ObjectId[];
}

