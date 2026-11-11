import mongoose, { Model, Schema } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    // Adds createdAt and updatedAt automatically
    { timestamps: true }
);

// Reuse the compiled model during hot reloads
const User =
    (mongoose.models.users as Model<IUser> | undefined) ??
    mongoose.model<IUser>("users", userSchema);

export default User;
