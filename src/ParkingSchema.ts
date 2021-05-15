import mongoose from 'mongoose';

const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IParking extends  mongoose.Document {
    parkingSpot:number;
    isBooked:boolean;
    blockedFor:string;
    blockedTill:Date;
    isReserved:boolean
}

export const ParkingSchema = new mongoose.Schema({
    parkingSpot:{type:Number},
    isBooked:{type:Boolean,default:false},
    blockedFor:{type:String,default:null},
    blockedTill:{type:Date,default:null},
    isReserved:{type:Boolean,default:false,required:true}
},{timestamps:{createdAt:true,updatedAt:true}});

ParkingSchema.plugin(AutoIncrement,{id:'parkingSpot_seq',inc_field:'parkingSpot'})


export const ParkingModel = mongoose.model<IParking>("parkingSlots", ParkingSchema, "parkingSlots");