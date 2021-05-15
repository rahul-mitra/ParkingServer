import { IUser, UserModel } from './UserSchema';
import express, { request } from 'express';
import http from 'http';
import { CorsOptions } from 'cors';
import cors from 'cors';
import MongooseDBConnection from './MongoDBConnection';
import { unlinkSync } from 'fs';
import md5 from 'md5'
import { IParking, ParkingModel } from './ParkingSchema';
import { Book, CheckBooking } from './Booking';
import { fork, ChildProcess } from 'child_process'
const port: any = 3000;
const DBconnectionString = "mongodb://localhost:27017/Parking"
const host = "0.0.0.0";




const options: CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token'
    ],

    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "*",
    preflightContinue: false

};

const MongoConnected = MongooseDBConnection(DBconnectionString);
// let child: ChildProcess = fork(__dirname + "/childProcess");

// child.on('message', function (m) {
//     // Receive results from child process
//     console.log('received: ', m);
// });

setInterval(() => {
    CheckBooking();
}, 10000);


const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: 1024 * 1024, type: "*" }));
app.use(express.static('public'))
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send(['Invalid Data']);
});

// setInterval(() => {
//     if (MongoConnected) {
//         child = fork("./childProcess");
//         child.on('message', function (m) {
//             // Receive results from child process
//             console.log('received: ', m);
//         });
//     }
//     else {
//         console.log("Not starting child process since mongo is not yet connected");
//     }
// }, 10000)


app.post("/register", async (req, res) => {
    console.log("Register user : ", req.body);
    var user = req.body;

    var dbUser = new UserModel({
        email: user.email,
        password: md5(user.password),
        city: user.city,
        fullName: user.fullName
    });
    var dbUserSaved = await dbUser.save()
    if (dbUserSaved) {
        console.log("User created ", dbUserSaved);
        res.send(dbUserSaved);
    }
    else {
        res.status(500).json({ error: "User account could not be created! contact @ rahul.mitra@rahulmitra.dev" });
    }
});

app.post("/createParking", async (req, res) => {
    console.log("Create parking : ", req.body);
    let dbParking: IParking;
    if (!req.body.isReserved)
        dbParking = new ParkingModel({
        });
    else
        dbParking = new ParkingModel({ isReserved: true });
    let dbParkingSaved = await dbParking.save()
    if (dbParkingSaved) {
        console.log("Parking created ", dbParkingSaved);
        res.send(dbParkingSaved);
    }
    else {
        res.status(500).json({ error: "parking could not be created!" });
    }
});

app.get("/getAllParkings", async (req, res) => {

    let allParkings = await ParkingModel.find().catch(err => {
        console.log("Get parking error ", err);
        res.status(500).json({ API: "getAllParkings", Error: err });
    });
    if (allParkings)
        res.send(allParkings);
});

app.get("/getAllBookedParkings", async (req, res) => {

    let allBookedParkings = await ParkingModel.find({ isBooked: true }).catch(err => {
        console.log("Get parking error ", err);
        res.status(500).json({ API: "getAllBookedParkings", Error: err });
    });
    if (allBookedParkings)
        res.send(allBookedParkings);
});

app.get("/getAllUsers", async (req, res) => {

    let allUsers = await UserModel.find().select('-password').catch(err => {
        console.log("Get Users error ", err);
        res.status(500).json({ API: "getAllUsers", Error: err });
    });
    if (allUsers) {
        res.send(allUsers);
    }
});

app.post("/login", async (req, res) => {
    console.log("Login request :", req.body);
    var user = req.body;
    user.password = md5(user.password);
    var response = { message: "user validated", success: true, user: null }
    var errorresponse = { message: "incorrect details", success: false }
    var client = await UserModel.findOne({ email: user.email, password: user.password }).catch(err => {
        console.debug("Unable to find user error occured ", err);
    });
    console.log("Login user data found is ", client)
    if (client) {
        response.user = client;
        res.send(response);
    }
    else {
        res.status(403).json(errorresponse);
    }
});

app.post("/bookParking", async (req, res, next) => {
    console.log("Book Parking slot ", req.body);
    let bookingStatus = await Book(req.body.email, req.body.isReserved).catch(error => {
        try {
            console.log("Rejected promise in booking ", error);
            res.status(error.status).json(error.reason);
            console.log("Rejected promise in booking sent");
            return next();
        } catch (err) {
            console.log("Error while sending error response ", err);
            res.status(500).json({ status: 500, reason: err, innerError: error });
            console.log("Error while sending error response sent!");
            return next();
        }
    });
    console.log("Booking status ", bookingStatus);
    if (bookingStatus) {
        res.send(bookingStatus);
    }
    // else {
    //     res.status(500).json({ status: 500, reason: "Null object from function" })
    // }
});




server.listen(process.env.PORT || port, () => {

    console.log(`server is listening on port ${port}`);
});

