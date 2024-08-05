import mongoose from "mongoose";
import { userRole } from "../enum/role";

export interface IRole {
  _id?: mongoose.Schema.Types.ObjectId;
  role: string;
}

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(userRole),
      unique: true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;
