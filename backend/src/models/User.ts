import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePic : string;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ""
    },
    profilePic : {
        type : String,
        default : ""
    }
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);