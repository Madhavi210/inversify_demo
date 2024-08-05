import mongoose,{ Schema, model, Document, Types } from 'mongoose';
import IUser from '../interface/user.interface';
import { userRole } from '../enum/role';
import Role, { IRole } from './role.model';


const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(userRole),
            default: userRole.CUSTOMER,
            select: false,
        },
        token: {
            type: String,
            default: null,
        },
        profilePic: {
            type: String,
        },
        permissionRoles: [{ type: Schema.Types.ObjectId }], // Array of ObjectId references to Role model
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    try {
        const roles: any = await Role.findOne({ role: this.role });
        if (roles) {
            this.permissionRoles.push(roles._id );
            next();
        }
    } catch (error:any) {
        next(error);
    }
});

export const User = model<IUser>('User', userSchema);
