const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const GuestDetails =new Schema({
    id: { type : String, required: true},
    name: { type: String, required: true},
    mobile: { type: String, required: true},
    email: { type: String, required: false},
    roomNumber: { type: Number, required: true},
    guests: { type: Number, required: true},
    checkIn: { type: String, required: true},
    checkOut: { type: String, required: true},
    stay: { type: String, required: true},
    amount: { type: Number, required: true},
    payment: { type: String, required: true},
});
 const GuestModel = model("Guest_Details", GuestDetails);
 module.exports = GuestModel;