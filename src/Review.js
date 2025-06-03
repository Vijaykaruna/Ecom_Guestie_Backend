const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
    id: { type: String, required: true},
    message: { type : String, required: true},
    guestId: { type : String, required: true},
    name: { type: String, required: true },
    date: { type: String, required: true },
    roomNumber: { type: Number, required: true },
})

module.exports = model("Review_Page", ReviewSchema);