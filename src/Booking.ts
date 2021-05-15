import { isConstructorDeclaration } from "typescript";
import { ParkingModel } from "./ParkingSchema";
import { UserModel } from "./UserSchema";

export const Book = (userEmail: string, isReserved: boolean): Promise<{ status: number, reason: string, result: boolean }> => {
    return new Promise(async (resolve, reject) => {
        try {
            //check if user is registered or not
            let userCheck = await UserModel.findOne({email:userEmail}).catch(userFindingError=>{
                reject({ status: 500, reason: "Unable to validate user registration", result: false });
                return;
            });
            if(!userCheck)
            {
                reject({ status: 404, reason: "User has not registered yet", result: false });
                return;
            }
            //check if user has already booked a slot then reject if true
            let previousBooking = await ParkingModel.findOne({ blockedFor: userEmail }).catch(err => {
                reject({ status: 500, reason: "Unable to validate user previous booking", result: false });
                return;
            })
            if (previousBooking) {
                reject({ status: 403, reason: "User already booked a slot", result: false });
                return;
            }
            let totalCount = await ParkingModel.countDocuments();
            let totalReservedCount = await ParkingModel.countDocuments({ isReserved: true });
            let totalNonReservedCount = totalCount - totalReservedCount;
            console.log("Total NonReserved slots count is [%s] and Reserved slots count is [%s]", totalNonReservedCount, totalReservedCount);
            //check if the booking request is for general parking space
            if (!isReserved) {
                let freeSpaceCount = await ParkingModel.countDocuments({ isBooked: false, isReserved: false });
                let reservedFreeSpaceCount = await ParkingModel.countDocuments({ isBooked: false, isReserved: true });
                console.log("Free space count for non reserved parking is %s and reserved parking is %s", freeSpaceCount, reservedFreeSpaceCount);
                // check if free space count for non reserved is below or above 50% or equal to 50%
                if ((totalNonReservedCount / 100 * 50) < (freeSpaceCount + reservedFreeSpaceCount)) {
                    console.log("Slots are booked less than 50% booking parking slot with 30 minutes time");
                    let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: false }).catch(err => {
                        console.log("Error while finding a non reserved slot ", err);
                        reject({ status: 500, reason: "Unable to book a non reserved user with 30 minutes time", result: false });
                    });
                    // a valid parking object is recieved
                    if (parkingObject) {
                        parkingObject.isBooked = true;
                        parkingObject.blockedFor = userEmail;
                        let bt = new Date();
                        bt.setMinutes(bt.getMinutes() + 30);
                        parkingObject.blockedTill = bt;
                        let confrimSaved = await parkingObject.save().catch(err => {
                            console.log("Error while saving a non reserved slot with 30 minutes time ", err);
                            reject({ status: 500, reason: "Unable to book a non reserved user with 30 minutes time, save error", result: false });
                            return;
                        });
                        if (confrimSaved) {
                            resolve({ status: 200, reason: "Booked parking for non reserved slot with 30 minutes time", result: true });
                            return;
                        }
                        else {
                            reject({ status: 500, reason: "Unable to book a non reserved user with 30 minutes time, null returned when saved", result: false });
                            return;
                        }
                    }
                    // db returned null object
                    else {
                        reject({ status: 500, reason: "Unable to book a non reserved user with 30 minutes time, null returned", result: false });
                        return;
                    }
                }
                // if 50% is already used up set booking time upto 15 minutes only
                else {
                    console.log("Slots are booked more than 50% booking parking slot with 15 minutes time");
                    let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: false }).catch(err => {
                        console.log("Error while finding a non reserved slot ", err);
                        reject({ status: 500, reason: "Unable to book a non reserved user with 15 minutes time", result: false });
                    });
                    // a valid parking object is recieved
                    if (parkingObject) {
                        parkingObject.isBooked = true;
                        parkingObject.blockedFor = userEmail;
                        let bt = new Date();
                        bt.setMinutes(bt.getMinutes() + 15);
                        parkingObject.blockedTill = bt;
                        let confrimSaved = await parkingObject.save().catch(err => {
                            console.log("Error while saving a non reserved slot with 15 minutes time ", err);
                            reject({ status: 500, reason: "Unable to book a non reserved user with 15 minutes time, save error", result: false });
                            return;
                        });
                        if (confrimSaved) {
                            resolve({ status: 200, reason: "Booked parking for non reserved slot with 15 minutes time", result: true });
                            return;
                        }
                        else {
                            reject({ status: 500, reason: "Unable to book a non reserved user with 15 minutes time, null returned when saved", result: false });
                            return;
                        }
                    }
                    // db returned null object
                    else {
                        reject({ status: 500, reason: "Unable to book a non reserved user with 15 minutes time, null returned", result: false });
                        return;
                    }
                }
            }
            // if the parking is for reserved space
            else {
                let freeSpaceCount = await ParkingModel.countDocuments({ isBooked: false, isReserved: false });
                let reservedFreeSpaceCount = await ParkingModel.countDocuments({ isBooked: false, isReserved: true });
                console.log("Free space count for non reserved parking is %s and reserved parking is %s", freeSpaceCount, reservedFreeSpaceCount);
                //check if reserved free space is 0 then assign general parking spot
                if (reservedFreeSpaceCount <= 0) {
                    // check if free space count for non reserved is below or above 50% or equal to 50%
                    if ((totalNonReservedCount / 100 * 50) < (freeSpaceCount + reservedFreeSpaceCount)) {
                        console.log("Slots are booked less than 50% booking parking slot with 30 minutes time");
                        let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: false }).catch(err => {
                            console.log("Error while finding a non reserved slot for reserved user", err);
                            reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 30 minutes time", result: false });
                        });
                        // a valid parking object is recieved
                        if (parkingObject) {
                            parkingObject.isBooked = true;
                            parkingObject.blockedFor = userEmail;
                            let bt = new Date();
                            bt.setMinutes(bt.getMinutes() + 30);
                            parkingObject.blockedTill = bt;
                            let confrimSaved = await parkingObject.save().catch(err => {
                                console.log("Error while saving a non reserved slot for reserved user with 30 minutes time ", err);
                                reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 30 minutes time, save error", result: false });
                                return;
                            });
                            if (confrimSaved) {
                                resolve({ status: 200, reason: "Booked parking for non reserved slot with 30 minutes time", result: true });
                                return;
                            }
                            else {
                                reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 30 minutes time, null returned when saved", result: false });
                                return;
                            }
                        }
                        // db returned null object
                        else {
                            reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 30 minutes time, null returned", result: false });
                            return;
                        }
                    }
                    // if 50% is already used up set booking time upto 15 minutes only
                    else {
                        console.log("Slots are booked more than 50% booking parking slot with 15 minutes time");
                        let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: false }).catch(err => {
                            console.log("Error while finding a non reserved slot ", err);
                            reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 15 minutes time", result: false });
                        });
                        // a valid parking object is recieved
                        if (parkingObject) {
                            parkingObject.isBooked = true;
                            parkingObject.blockedFor = userEmail;
                            let bt = new Date();
                            bt.setMinutes(bt.getMinutes() + 15);
                            parkingObject.blockedTill = bt;
                            let confrimSaved = await parkingObject.save().catch(err => {
                                console.log("Error while saving a non reserved slot with 15 minutes time ", err);
                                reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 15 minutes time, save error", result: false });
                                return;
                            });
                            if (confrimSaved) {
                                resolve({ status: 200, reason: "Booked parking for non reserved slot with 15 minutes time", result: true });
                                return;
                            }
                            else {
                                reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 15 minutes time, null returned when saved", result: false });
                                return;
                            }
                        }
                        // db returned null object
                        else {
                            reject({ status: 500, reason: "Unable to book a non reserved slot for reserved user with 15 minutes time, null returned", result: false });
                            return;
                        }
                    }
                }
                //if space is available for reserved parking then allot from available reserved parking
                else {
                    // check if free space count for non reserved is below or above 50% or equal to 50%
                    if ((totalNonReservedCount / 100 * 50) < (freeSpaceCount + reservedFreeSpaceCount)) {
                        console.log("Slots are booked less than 50% booking parking slot with 30 minutes time for reserved parking");
                        let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: true }).catch(err => {
                            console.log("Error while finding a non reserved slot ", err);
                            reject({ status: 500, reason: "Unable to book a reserved user with 30 minutes time", result: false });
                        });
                        // a valid parking object is recieved
                        if (parkingObject) {
                            parkingObject.isBooked = true;
                            parkingObject.blockedFor = userEmail;
                            let bt = new Date();
                            bt.setMinutes(bt.getMinutes() + 30);
                            parkingObject.blockedTill = bt;
                            let confrimSaved = await parkingObject.save().catch(err => {
                                console.log("Error while saving a reserved slot with 30 minutes time ", err);
                                reject({ status: 500, reason: "Unable to book a reserved user with 30 minutes time, save error", result: false });
                                return;
                            });
                            if (confrimSaved) {
                                resolve({ status: 200, reason: "Booked parking for reserved slot with 30 minutes time", result: true });
                                return;
                            }
                            else {
                                reject({ status: 500, reason: "Unable to book a reserved user with 30 minutes time, null returned when saved", result: false });
                                return;
                            }
                        }
                        // db returned null object
                        else {
                            reject({ status: 500, reason: "Unable to book a reserved user with 30 minutes time, null returned", result: false });
                            return;
                        }
                    }
                    // if 50% is already used up set booking time upto 15 minutes only
                    else {
                        console.log("slots are booked more than 50% booking parking slot with 15 minutes time");
                        let parkingObject = await ParkingModel.findOne({ isBooked: false, isReserved: false }).catch(err => {
                            console.log("Error while finding a reserved slot ", err);
                            reject({ status: 500, reason: "Unable to book a reserved user with 15 minutes time", result: false });
                        });
                        // a valid parking object is recieved
                        if (parkingObject) {
                            parkingObject.isBooked = true;
                            parkingObject.blockedFor = userEmail;
                            let bt = new Date();
                            bt.setMinutes(bt.getMinutes() + 15);
                            parkingObject.blockedTill = bt;
                            let confrimSaved = await parkingObject.save().catch(err => {
                                console.log("Error while saving a reserved slot with 15 minutes time ", err);
                                reject({ status: 500, reason: "Unable to book a reserved user with 15 minutes time, save error", result: false });
                                return;
                            });
                            if (confrimSaved) {
                                resolve({ status: 200, reason: "Booked parking for reserved slot with 15 minutes time", result: true });
                                return;
                            }
                            else {
                                reject({ status: 500, reason: "Unable to book a reserved user with 15 minutes time, null returned when saved", result: false });
                                return;
                            }
                        }
                        // db returned null object
                        else {
                            reject({ status: 500, reason: "Unable to book a reserved user with 15 minutes time, null returned", result: false });
                            return;
                        }
                    }
                }
            }
        } catch (error) {
            reject({ status: 500, reason: error, result: false });
        }
    });
};


export const CheckBooking = () => {
    ParkingModel.find({ isBooked: true }).then(docs => {
        console.log("Parkings slots checking for booked slots freeing ",docs?.length);
        docs.forEach(parkingSlot => {
            let check = CompareDateTime(parkingSlot.blockedTill, Date.now());
            if (check == 1) {
                console.log("For parking slot id [%s] time is remaining till [%s]", parkingSlot.parkingSpot, parkingSlot.blockedTill);
            }
            else {
                parkingSlot.blockedTill = undefined;
                parkingSlot.blockedFor = undefined;
                parkingSlot.isBooked = false;
                parkingSlot.save().then(res => {
                    console.log("Successfully freed a parking slot ", res);
                }).catch(err => {
                    console.log("Error freeing a expired booking slot ", err);
                });
            }
        });
    }).catch(error => {
        console.log("Error while checking the db for expired bookings ", error);
    });
};

const CompareDateTime = (d1, d2): Number => {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    if (date1.getTime() > date2.getTime())
        return 1;
    else if (date2.getTime() > date1.getTime())
        return -1;
    else
        return 0;
}