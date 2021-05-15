import mongoose from 'mongoose';


export interface IUserBase {
    email: string;
    fullName:string;
    city:string;
}



export interface IUser extends IUserBase, mongoose.Document {
    email: string;
    password: string;
    fullName:string;
    city:string;
}

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullName:{type:String,required: true},
    city:{type:String,required:true}
},{timestamps:{createdAt:true,updatedAt:true}});

export const UserModel = mongoose.model<IUser>("users", UserSchema, "users");