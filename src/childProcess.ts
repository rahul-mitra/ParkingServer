import { ParkingModel } from "./ParkingSchema";


setInterval(() => {
    try {
        ParkingModel.find({}, (err, docs) => {
            if (docs.length) {
                console.log(docs.length);
                process.send(docs);
            }
        });
    } catch (error) {
        console.log("Child process error ",error);
    }
}, 10000);