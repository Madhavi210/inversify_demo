// permission.interface.ts
import mongoose, { Schema } from "mongoose";

export interface IPermission {
  moduleId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  read: boolean;
  write: boolean;
}

const permissionSchema = new Schema(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    write: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;
